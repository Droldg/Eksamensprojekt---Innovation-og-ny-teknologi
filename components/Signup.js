// Signup.js
// Signup komponent til oprettelse af ny bruger ved hjælp af Firebase
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../database/database";
import styles from "../style/styles";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async () => {
    const emailTrimmed = email.trim().toLowerCase();
    const phoneTrimmed = phone.trim();

    const isEmailValid = /\S+@\S+\.\S+/.test(emailTrimmed);
    if (!isEmailValid) {
      Alert.alert(
        "Ugyldig e-mail",
        "Indtast en gyldig e-mailadresse (fx navn@domæne.dk)."
      );
      return;
    }

    // Meget enkel telefonvalidering: min. 8 tegn, tal + evt. +, mellemrum, bindestreg
    if (!/^[0-9+\s-]{8,}$/.test(phoneTrimmed)) {
      Alert.alert(
        "Ugyldigt telefonnummer",
        "Indtast et gyldigt telefonnummer (mindst 8 cifre)."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "For kort adgangskode",
        "Adgangskoden skal være mindst 6 tegn."
      );
      return;
    }

    try {
      // Opret bruger i Firebase Authentication
      const cred = await createUserWithEmailAndPassword(
        auth,
        emailTrimmed,
        password
      );

      // Gem ekstra brugerdata i Firestore (collection: users)
      // locID sættes til null fra start – udfyldes senere fra HomeScreen
      await setDoc(doc(db, "users", cred.user.uid), {
        email: emailTrimmed,
        phone: phoneTrimmed,
        locID: null,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        "Bruger oprettet",
        "Velkommen! Du er nu oprettet som bruger."
      );
    } catch (e) {
      const map = {
        "auth/email-already-in-use": "E-mailen er allerede registreret.",
        "auth/invalid-email": "Ugyldig e-mailadresse.",
        "auth/weak-password": "Adgangskoden er for svag (min. 6 tegn).",
      };
      Alert.alert("Fejl", map[e.code] || e.message);
    }
  };

  return (
    <View style={styles.authContainer}>
      <View style={styles.authCard}>
        <Text style={styles.title}>Opret bruger</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefonnummer"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Adgangskode (min. 6 tegn)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Opret bruger</Text>
        </Pressable>
      </View>
    </View>
  );
}
// Signup.js komponenten håndterer brugerregistrering ved at validere input,
// oprette brugeren i Firebase Authentication og gemme ekstra data i Firestore.
