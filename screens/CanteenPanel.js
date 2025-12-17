import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import styles from "../style/styles";
import { auth, db } from "../database/database";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export default function CanteenPanel() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [locID, setLocID] = useState(null);
  const [role, setRole] = useState(null);

  const [offersLoading, setOffersLoading] = useState(false);
  const [offers, setOffers] = useState([]);

  const [title, setTitle] = useState("");
  const [pickup, setPickup] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [itemsInput, setItemsInput] = useState("");
  const [active, setActive] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Hent brugerens rolle og locID
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setProfileError("Ingen bruger er logget ind.");
      setProfileLoading(false);
      return;
    }

    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setLocID(data.locID || null);
          setRole(data.role || null);
        } else {
          setLocID(null);
          setRole(null);
          setProfileError("Brugerprofil blev ikke fundet.");
        }
        setProfileLoading(false);
      },
      (err) => {
        console.log("Fejl ved profil:", err);
        setProfileError("Kunne ikke hente brugerprofilen.");
        setProfileLoading(false);
      }
    );

    return unsub;
  }, []);

  // Hent tilbud for brugerens lokation
  useEffect(() => {
    if (!locID || role !== "canteen") {
      setOffers([]);
      return;
    }
    setOffersLoading(true);
    const q = query(collection(db, "offers"), where("locID", "==", locID));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOffers(list);
        setOffersLoading(false);
      },
      (err) => {
        console.log("Fejl ved hentning af tilbud:", err);
        setOffersLoading(false);
      }
    );
    return unsub;
  }, [locID, role]);

  const itemsArray = useMemo(
    () =>
      itemsInput
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    [itemsInput]
  );

  const resetForm = () => {
    setSelectedId(null);
    setTitle("");
    setPickup("");
    setPrice("");
    setQty("");
    setItemsInput("");
    setActive(true);
  };

  const loadOfferToForm = (offer) => {
    setSelectedId(offer.id);
    setTitle(offer.title || "");
    setPickup(offer.pickup || "");
    setPrice(String(offer.price ?? ""));
    setQty(String(offer.qty ?? ""));
    setItemsInput(Array.isArray(offer.items) ? offer.items.join(", ") : "");
    setActive(offer.active !== false);
  };

  const handleSave = async () => {
    if (!locID) {
      Alert.alert("Manglende locID", "Tilføj arbejdspladskode før du opretter et tilbud.");
      return;
    }

    const titleTrim = title.trim();
    const pickupTrim = pickup.trim();
    const priceNum = Number(price);
    const qtyNum = Number(qty);

    if (!titleTrim || !pickupTrim || Number.isNaN(priceNum) || Number.isNaN(qtyNum)) {
      Alert.alert("Manglende felter", "Udfyld titel, afhentning, pris og antal.");
      return;
    }

    if (priceNum < 0 || qtyNum < 0) {
      Alert.alert("Ugyldige tal", "Pris og antal skal være 0 eller højere.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: titleTrim,
        pickup: pickupTrim,
        price: priceNum,
        qty: qtyNum,
        items: itemsArray,
        locID,
        active,
      };

      if (selectedId) {
        await updateDoc(doc(db, "offers", selectedId), payload);
      } else {
        await addDoc(collection(db, "offers"), { ...payload, createdAt: serverTimestamp() });
      }

      Alert.alert("Gemt", selectedId ? "Tilbuddet er opdateret." : "Tilbuddet er oprettet.");
      resetForm();
    } catch (e) {
      console.log("Fejl ved gem:", e);
      Alert.alert("Fejl", "Kunne ikke gemme tilbuddet. Tjek forbindelsen og reglerne.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    Alert.alert("Slet tilbud", "Er du sikker på, at du vil slette tilbuddet?", [
      { text: "Annuller", style: "cancel" },
      {
        text: "Slet",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "offers", selectedId));
            resetForm();
            Alert.alert("Slettet", "Tilbuddet er fjernet.");
          } catch (e) {
            console.log("Fejl ved slet:", e);
            Alert.alert("Fejl", "Kunne ikke slette tilbuddet.");
          }
        },
      },
    ]);
  };

  if (profileLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (profileError || role !== "canteen" || !locID) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <View style={styles.infoCard}>
          <Text style={styles.title}>Adgang nægtet</Text>
          <Text style={styles.infoText}>
            {profileError
              ? profileError
              : !locID
              ? "Tilføj din 4-cifrede arbejdspladskode for at bruge kantinepanelet."
              : "Denne bruger er ikke markeret som kantine-medarbejder."}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, backgroundColor: "#FFF4E9" }}>
      <Text style={styles.title}>Kantinepanel</Text>
      <Text style={styles.helperText}>
        Opret og opdater tilbud for lokation {locID}. Vælg et eksisterende tilbud for at redigere eller slette.
      </Text>

      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>{selectedId ? "Rediger tilbud" : "Nyt tilbud"}</Text>

        <TextInput
          style={styles.input}
          placeholder="Titel (fx Pastaboks)"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Afhentningsvindue (fx 15:30-16:30)"
          value={pickup}
          onChangeText={setPickup}
        />

        <TextInput
          style={styles.input}
          placeholder="Pris (kr)"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          style={styles.input}
          placeholder="Antal bokse"
          keyboardType="number-pad"
          value={qty}
          onChangeText={setQty}
        />

        <TextInput
          style={styles.input}
          placeholder="Indhold (kommasepareret, fx Pasta, Salat, Brød)"
          value={itemsInput}
          onChangeText={setItemsInput}
        />

        <View style={[styles.row, { marginVertical: 8 }]}>
          <Text style={{ color: "#374151" }}>Aktiv</Text>
          <Switch value={active} onValueChange={setActive} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.btnPrimary,
            pressed && styles.btnPrimaryPressed,
            saving && styles.btnDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={saving ? styles.btnDisabledText : styles.btnPrimaryText}>
            {selectedId ? "Opdater" : "Opret"}
          </Text>
        </Pressable>

        <View style={styles.v8} />
        <View style={[styles.row, { gap: 8 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnOutline,
              pressed && styles.btnOutlinePressed,
              { flex: 1 },
            ]}
            onPress={resetForm}
          >
            <Text style={styles.btnOutlineText}>Nulstil</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: "#D33A2C", flex: 1 },
              pressed && { opacity: 0.9 },
              !selectedId && styles.btnDisabled,
            ]}
            onPress={handleDelete}
            disabled={!selectedId}
          >
            <Text style={selectedId ? styles.btnPrimaryText : styles.btnDisabledText}>Slet</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.v16} />
      <Text style={styles.cardTitle}>Eksisterende tilbud</Text>
      {offersLoading ? <ActivityIndicator /> : null}

      {offers.map((offer) => (
        <Pressable
          key={offer.id}
          style={({ pressed }) => [
            styles.card,
            pressed && styles.btnOutlinePressed,
            selectedId === offer.id && { borderColor: "#1D6142" },
          ]}
          onPress={() => loadOfferToForm(offer)}
        >
          <View style={styles.row}>
            <Text style={styles.cardTitle}>{offer.title || "(uden titel)"}</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: offer.active !== false ? "#1D6142" : "#9CA3AF" },
              ]}
            >
              <Text style={styles.badgeText}>{offer.active !== false ? "Aktiv" : "Pauset"}</Text>
            </View>
          </View>
          <Text style={styles.cardLine}>Afhentning: {offer.pickup || "-"}</Text>
          <Text style={styles.cardLine}>Pris: {offer.price} kr - Antal: {offer.qty}</Text>
          {Array.isArray(offer.items) && offer.items.length ? (
            <View style={styles.chipRow}>
              {offer.items.map((x, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{x}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}
