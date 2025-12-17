// Authentication.js håndterer skift mellem Login og Signup komponenter.
import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import styles from "../style/styles";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function Authentication() {
  const [mode, setMode] = useState("login");

  return (
    <View style={styles.container}>
      {mode === "login" ? <Login /> : <Signup />}

      <Pressable
        style={styles.switchModeButton}
        onPress={() => setMode(mode === "login" ? "signup" : "login")}
      >
        <Text style={styles.switchModeText}>
          {mode === "login" ? "Mangler du en konto? Opret bruger" : "Har du en konto? Log ind"}
        </Text>
      </Pressable>
    </View>
  );
}
