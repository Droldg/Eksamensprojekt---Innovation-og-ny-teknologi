import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, Modal, TextInput } from "react-native";
import styles from "../style/styles";
import { auth, db } from "../database/database";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

function AppButton({ title, onPress, variant = "primary", full = true, size = "md" }) {
  const base = [styles.btn, full && styles.btnFull];

  const map = {
    primary: [styles.btnPrimary],
    secondary: [styles.btnSecondary],
    outline: [styles.btnOutline],
  };
  const pressedMap = {
    primary: styles.btnPrimaryPressed,
    secondary: styles.btnSecondaryPressed,
    outline: styles.btnOutlinePressed,
  };
  const textMap = {
    primary: styles.btnPrimaryText,
    secondary: styles.btnSecondaryText,
    outline: styles.btnOutlineText,
  };

  const sizeStyle =
    size === "lg"
      ? { height: 56, borderRadius: 14 }
      : size === "sm"
      ? { height: 42, borderRadius: 10 }
      : null;
  const textSize =
    size === "lg"
      ? { fontSize: 16 }
      : size === "sm"
      ? { fontSize: 13 }
      : null;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        ...base,
        ...(map[variant] || map.primary),
        sizeStyle,
        pressed && (pressedMap[variant] || pressedMap.primary),
      ]}
      onPress={onPress}
    >
      <Text style={[textMap[variant], textSize]}>{title}</Text>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const [hasLocation, setHasLocation] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationPin, setLocationPin] = useState("");
  const [role, setRole] = useState(null);
  const [locId, setLocId] = useState(null);

  // Hent brugerens profil og se om der allerede er en locID
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoadingUser(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setLocId(data.locID || null);
          setHasLocation(!!data.locID);
          setRole(data.role || null);
        } else {
          setLocId(null);
          setHasLocation(false);
          setRole(null);
        }
        setLoadingUser(false);
      },
      (e) => {
        console.log("Fejl ved hentning af brugerprofil:", e);
        setLocId(null);
        setLoadingUser(false);
      }
    );

    return unsubscribe;
  }, []);

  // Gem arbejdspladskode på brugeren
  const handleSaveLocation = async () => {
    const pinTrimmed = locationPin.trim();

    if (!/^\d{4}$/.test(pinTrimmed)) {
      Alert.alert("Ugyldig kode", "Arbejdspladskoden skal være præcis 4 cifre.");
      return;
    }

    try {
      // Tjek at location findes i Firestore
      const locationRef = doc(db, "locations", pinTrimmed);
      const locationSnap = await getDoc(locationRef);

      if (!locationSnap.exists()) {
        Alert.alert("Ugyldig kode", "Der findes ingen arbejdsplads med denne kode.");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Fejl", "Ingen bruger er logget ind.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { locID: pinTrimmed });

      setHasLocation(true);
      setShowLocationModal(false);
      setLocationPin("");
      Alert.alert("Gemt", "Din arbejdspladskode er nu tilknyttet din profil.");
    } catch (e) {
      console.log("Fejl ved opdatering af locID:", e);
      Alert.alert("Fejl", `Kunne ikke gemme koden. (${e.code || ""} ${e.message || ""})`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: "#E6F0EC", borderColor: "transparent" }]}>
        <Text style={styles.appTitle}>MadRedder</Text>
        <Text style={[styles.subtitle, { marginBottom: 14 }]}>
          Få overblik over dagens rester i kantinen og reserver en boks til lav pris. Husk at vise din reservation
          ved afhentning.
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={[styles.badge, { backgroundColor: "#1D6142" }]}>
            <Text style={styles.badgeText}>Kantine</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: "#FF9A8A" }]}>
            <Text style={styles.badgeText}>Daglige tilbud</Text>
          </View>
        </View>
      </View>

      <View style={styles.v16} />
      <AppButton title="Se tilbud" variant="primary" size="lg" onPress={() => navigation.navigate("Offers")} />

      <View style={styles.v8} />
      <AppButton
        title="Reserveret tilbud"
        variant="outline"
        size="lg"
        onPress={() => navigation.navigate("ReservedOffers")}
      />

      <View style={styles.v8} />
      <AppButton title="Min profil" variant="secondary" size="lg" onPress={() => navigation.navigate("Profile")} />

      {(() => {
        const isCanteen = (role || "").toLowerCase() === "canteen";
        const canSeePanel = isCanteen && !!locId;
        return canSeePanel ? (
          <>
            <View style={styles.v8} />
            <AppButton
              title="Kantinepanel"
              variant="primary"
              size="lg"
              onPress={() => navigation.navigate("CanteenPanel")}
            />
          </>
        ) : null;
      })()}

      {!loadingUser && !hasLocation && (
        <>
          <View style={styles.v8} />
          <AppButton
            title="Tilføj arbejdspladskode"
            variant="primary"
            size="lg"
            onPress={() => setShowLocationModal(true)}
          />
        </>
      )}

      <View style={styles.v8} />
      <AppButton title="Info" variant="outline" size="lg" onPress={() => navigation.navigate("Info")} />

      <View style={styles.v16} />
      <Text style={styles.helperText}>
        Tip: Tilbud opdateres i løbet af eftermiddagen. Afhent inden for det angivne tidsrum.
      </Text>

      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Tilføj arbejdspladskode</Text>
            <Text style={styles.modalText}>Indtast den 4-cifrede kode, du har fået af din arbejdsplads.</Text>

            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder="Fx 1234"
              keyboardType="number-pad"
              maxLength={4}
              value={locationPin}
              onChangeText={setLocationPin}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalButtonSecondary}
                onPress={() => {
                  setShowLocationModal(false);
                  setLocationPin("");
                }}
              >
                <Text style={styles.modalButtonSecondaryText}>Annuller</Text>
              </Pressable>
              <Pressable style={styles.modalButtonSecondary} onPress={handleSaveLocation}>
                <Text style={styles.modalButtonSecondaryText}>Gem kode</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
