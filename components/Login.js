// Login.js
// Login.js komponent til brugerlogin ved hjælp af Firebase Authentication
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/database";
import styles from "../style/styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // ✅ Vis besked ved succesfuldt login
      Alert.alert("Velkommen!", "Du er nu logget ind.");
    } catch (e) {
      Alert.alert("Fejl", e.message);
    }
  };

  return (
    <View style={styles.authContainer}>
      <View style={styles.authCard}>
        <Text style={styles.title}>Log ind</Text>

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
          placeholder="Adgangskode"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log ind</Text>
        </Pressable>
      </View>
    </View>
  );
}
