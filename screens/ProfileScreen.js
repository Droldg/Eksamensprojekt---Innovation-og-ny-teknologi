// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import styles from "../style/styles";
import { auth, db } from "../database/database";
import { signOut, updatePassword, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const [phone, setPhone] = useState("");        // gemt nummer (visning)
  const [newPhone, setNewPhone] = useState("");  // nyt nummer i inputfelt
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const email = auth.currentUser?.email ?? "(ukendt)";

  // Hent profil (telefonnummer) fra Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          const currentPhone = data.phone || "";
          setPhone(currentPhone);   // vises øverst
        }
      } catch (e) {
        console.log("Fejl ved hentning af profil:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert(
        "Logget ud",
        "Du er nu logget ud. Vi håber at se dig igen snart!"
      );
    } catch (error) {
      Alert.alert("Fejl", "Kunne ikke logge ud. Prøv igen.");
    }
  };

  // Opdater telefonnummer i Firestore
  const handleUpdatePhone = async () => {
    const phoneTrimmed = newPhone.trim();

    if (!/^[0-9+\s-]{8,}$/.test(phoneTrimmed)) {
      Alert.alert(
        "Ugyldigt telefonnummer",
        "Indtast et gyldigt telefonnummer (mindst 8 cifre)."
      );
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Fejl", "Ingen bruger er logget ind.");
        return;
      }

      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { phone: phoneTrimmed });

      setPhone(phoneTrimmed);   // opdatér visningen
      setNewPhone("");          // ryd feltet
      Alert.alert("Opdateret", "Dit telefonnummer er opdateret.");
    } catch (e) {
      console.log("Fejl ved opdatering af telefon:", e);
      Alert.alert("Fejl", "Telefonnummer kunne ikke opdateres. Prøv igen.");
    }
  };

  // Skift adgangskode i Firebase Auth
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Manglende oplysninger", "Udfyld begge adgangskode-felter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Uoverensstemmelse", "Adgangskoderne er ikke ens.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "For kort adgangskode",
        "Adgangskoden skal være mindst 6 tegn."
      );
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Fejl", "Ingen bruger er logget ind.");
        return;
      }

      await updatePassword(user, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Opdateret", "Din adgangskode er ændret.");
    } catch (e) {
      console.log("Fejl ved skift af adgangskode:", e);
      if (e.code === "auth/requires-recent-login") {
        Alert.alert(
          "Session udløbet",
          "Log ud og ind igen, før du kan ændre adgangskode."
        );
      } else {
        Alert.alert("Fejl", "Adgangskoden kunne ikke ændres. Prøv igen.");
      }
    }
  };

  // Åbn modal til sletning
  const openDeleteModal = () => {
    setDeleteVisible(true);
  };

  // Luk modal uden at slette
  const closeDeleteModal = () => {
    if (!deleting) {
      setDeleteVisible(false);
    }
  };

  // Bekræft sletning: Firestore-dokument + Auth-konto
  const confirmDeleteProfile = async () => {
    try {
      setDeleting(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Fejl", "Ingen bruger er logget ind.");
        setDeleting(false);
        setDeleteVisible(false);
        return;
      }

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      setDeleting(false);
      setDeleteVisible(false);

      Alert.alert(
        "Profil slettet",
        "Din konto og dine gemte oplysninger er nu fjernet. Tak for denne gang!"
      );
    } catch (error) {
      console.log("Fejl ved sletning af profil:", error);
      setDeleting(false);
      if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Login kræves",
          "Log ud og ind igen, før du kan slette din profil."
        );
      } else {
        Alert.alert("Fejl", "Profilen kunne ikke slettes. Prøv igen.");
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.authContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.authContainer}>
      <View style={styles.authCard}>
        <Text style={styles.title}>Min profil</Text>

        <Text style={{ marginBottom: 4 }}>
          Du er logget ind som:{" "}
          <Text style={{ fontWeight: "700", color: "#2563EB" }}>{email}</Text>
        </Text>

        <Text style={{ marginBottom: 16 }}>
          Dit Telefonnummer:{" "}
          <Text style={{ fontWeight: "700" }}>
            {phone || "(ikke registreret)"}
          </Text>
        </Text>

        {/* Skift telefonnummer */}
        <Text style={{ fontWeight: "700", marginTop: 12, marginBottom: 4 }}>
          Skift telefonnummer
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nyt telefonnummer"
          keyboardType="phone-pad"
          value={newPhone}
          onChangeText={setNewPhone}
        />
        <Pressable style={styles.button} onPress={handleUpdatePhone}>
          <Text style={styles.buttonText}>Opdater telefonnummer</Text>
        </Pressable>

        {/* Skift adgangskode */}
        <Text style={{ fontWeight: "700", marginTop: 20, marginBottom: 4 }}>
          Skift adgangskode
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Ny adgangskode (min. 6 tegn)"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Gentag ny adgangskode"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Pressable style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Opdater adgangskode</Text>
        </Pressable>

        {/* Knap-række: Log ud (venstre) + Slet profil (højre) */}
        <View style={styles.profileActionsRow}>
          <Pressable
            onPress={handleLogout}
            style={({ hovered, pressed }) => [
              styles.logoutButton,
              styles.profileActionLeft,
              (hovered || pressed) && styles.logoutButtonHover,
            ]}
          >
            <Text style={styles.buttonText}>Log ud</Text>
          </Pressable>

          <Pressable
            onPress={openDeleteModal}
            style={({ hovered, pressed }) => [
              styles.logoutButton,
              styles.profileActionRight,
              { backgroundColor: "#D33A2C" },
              (hovered || pressed) && { backgroundColor: "#B91C1C" },
            ]}
          >
            <Text style={styles.buttonText}>Slet profil</Text>
          </Pressable>
        </View>
      </View>

      {/* Modal til sletning */}
      <Modal
        transparent
        visible={deleteVisible}
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Slet profil?</Text>
            <Text style={styles.modalText}>
              Hvis du sletter din profil, fjernes:
            </Text>
            <Text style={styles.modalText}>
              • Din bruger i MadRedder{"\n"}
              • Dit telefonnummer og andre gemte oplysninger{"\n"}
            </Text>
            <Text style={[styles.modalText, { marginTop: 8 }]}>
              Dette kan <Text style={{ fontWeight: "700" }}>ikke</Text> fortrydes.
              Er du sikker på, at du vil fortsætte?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalButtonSecondary}
                onPress={closeDeleteModal}
                disabled={deleting}
              >
                <Text style={styles.modalButtonSecondaryText}>Fortryd</Text>
              </Pressable>

              <Pressable
                style={styles.modalButtonDanger}
                onPress={confirmDeleteProfile}
                disabled={deleting}
              >
                <Text style={styles.modalButtonDangerText}>
                  {deleting ? "Sletter..." : "Ja, slet min profil"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
// ProfileScreen.js komponenten viser brugerens profiloplysninger, giver mulighed for at opdatere telefonnummer og adgangskode, samt logge ud eller slette profilen.