import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, Platform, ActivityIndicator, Alert } from "react-native";
import styles from "../style/styles";
import { useReservations } from "../context/ReservationsContext";
import { auth, db } from "../database/database";
import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  where,
} from "firebase/firestore";

export default function OffersScreen() {
  const { add, items: reservedItems } = useReservations();

  const [offers, setOffers] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [reservedIds, setReservedIds] = useState(new Set());

  const [locID, setLocID] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [error, setError] = useState(null);

  // Synkroniser markerede reservationer med global state (så de vises som "Reserveret")
  useEffect(() => {
    setReservedIds(new Set(reservedItems.map((x) => String(x.id))));
  }, [reservedItems]);

  // Lyt til brugerens profil for at få locID
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setLocID(data.locID || null);
        } else {
          setLocID(null);
        }
        setLoadingProfile(false);
      },
      (err) => {
        console.log("Fejl ved hentning af brugerprofil:", err);
        setError("Kunne ikke hente din profil");
        setLoadingProfile(false);
      }
    );

    return unsubscribe;
  }, []);

  // Lyt til tilbud for den aktuelle lokation
  useEffect(() => {
    if (!locID) {
      setOffers([]);
      return;
    }

    setLoadingOffers(true);
    const q = query(collection(db, "offers"), where("locID", "==", locID));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => {
            const data = d.data();
            const price = typeof data.price === "string" ? Number(data.price) : data.price;
            const qty = typeof data.qty === "string" ? Number(data.qty) : data.qty;
            return {
              id: d.id,
              title: data.title || "",
              items: Array.isArray(data.items) ? data.items : [],
              price: Number.isFinite(price) ? price : 0,
              pickup: data.pickup || "",
              qty: Number.isFinite(qty) ? qty : 0,
              locID: data.locID || null,
              active: data.active !== false,
            };
          })
          .filter((o) => o.active);

        setOffers(list);
        setLoadingOffers(false);
      },
      (err) => {
        console.log("Fejl ved hentning af tilbud:", err);
        setError("Kunne ikke hente tilbud");
        setLoadingOffers(false);
      }
    );

    return unsubscribe;
  }, [locID]);

  const list = useMemo(
    () => offers.filter((o) => (onlyAvailable ? o.qty > 0 : true)),
    [offers, onlyAvailable]
  );

  const reserve = async (offer) => {
    if (reservedIds.has(offer.id)) return;
    if (!locID) {
      Alert.alert("Mangler arbejdsplads", "Tilføj din arbejdspladskode først.");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const ref = doc(db, "offers", offer.id);
        const snap = await transaction.get(ref);
        if (!snap.exists()) {
          throw new Error("Tilbud findes ikke længere.");
        }

        const data = snap.data();
        if (data.locID !== locID) {
          throw new Error("Tilbud hører til en anden lokation.");
        }

        const currentQty = typeof data.qty === "string" ? Number(data.qty) : data.qty || 0;
        if (currentQty <= 0) {
          throw new Error("Udsolgt");
        }

        transaction.update(ref, { qty: currentQty - 1 });
      });

      // Optimistisk lokalt bump ned – Firestore snapshot korrigerer lige efter
      setOffers((prev) =>
        prev.map((o) => (o.id === offer.id ? { ...o, qty: Math.max(0, o.qty - 1) } : o))
      );

      add({
        id: offer.id,
        title: offer.title,
        price: offer.price,
        pickupWindow: offer.pickup,
        items: offer.items,
      });

      setReservedIds((prev) => new Set([...prev, offer.id]));
    } catch (e) {
      if (e.message === "Udsolgt") {
        Alert.alert("Udsolgt", "Desværre, boksen blev lige nappet.");
      } else {
        console.log("Fejl ved reservation:", e);
        Alert.alert("Fejl", e.message || "Kunne ikke reservere. Prøv igen.");
      }
    }
  };

  const badgeBg = (qty) => (qty > 0 ? "#1D6142" : "#D33A2C");

  if (loadingProfile) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!locID) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={styles.title}>Tilføj arbejdspladskode</Text>
        <Text style={styles.helperText}>
          Gå til forsiden og tilknyt din 4-cifrede arbejdspladskode for at se tilbud.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tilbud i dag</Text>

      <View style={styles.filterBar}>
        <Pressable
          onPress={() => setOnlyAvailable((v) => !v)}
          style={({ pressed }) => [
            styles.filterBtn,
            onlyAvailable && styles.filterBtnActive,
            pressed && Platform.OS === "android" ? { opacity: 0.9 } : null,
          ]}
        >
          <Text style={[styles.filterText, onlyAvailable && styles.filterTextActive]}>
            {onlyAvailable ? "Vis alle" : "Kun ledige"}
          </Text>
        </Pressable>
      </View>

      {loadingOffers ? (
        <View style={{ paddingVertical: 16 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {error ? (
        <Text style={[styles.helperText, { color: "#D33A2C" }]}>{error}</Text>
      ) : null}

      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const alreadyReserved = reservedIds.has(item.id);
          const isSoldOut = item.qty === 0;
          const disabled = isSoldOut || alreadyReserved;

          return (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <View style={[styles.badge, { backgroundColor: badgeBg(item.qty) }]}>
                  <Text style={styles.badgeText}>
                    {isSoldOut ? "Udsolgt" : `${item.qty} tilbage`}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardLine}>Afhentning: {item.pickup}</Text>
              <Text style={styles.cardLine}>Pris: {item.price} kr.</Text>

              <View style={styles.chipRow}>
                {item.items.map((x, i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{x}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => reserve(item)}
                disabled={disabled}
                style={({ pressed }) => [
                  styles.btn,
                  disabled ? styles.btnDisabled : styles.btnPrimary,
                  pressed && !disabled && styles.btnPrimaryPressed,
                ]}
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
              >
                <Text style={disabled ? styles.btnDisabledText : styles.btnPrimaryText}>
                  {isSoldOut ? "Udsolgt" : alreadyReserved ? "Reserveret" : "Reserver"}
                </Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}
