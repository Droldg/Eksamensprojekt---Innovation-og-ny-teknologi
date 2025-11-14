// HomeScreen.js
import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "../style/styles";

function AppButton({ title, onPress, variant = "primary", full = true }) {
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

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        ...base,
        ...(map[variant] || map.primary),
        pressed && (pressedMap[variant] || pressedMap.primary),
      ]}
      onPress={onPress}
    >
      <Text style={textMap[variant]}>{title}</Text>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>MadRedder</Text>
      <Text style={styles.subtitle}>
        Få overblik over dagens rester i kantinen og reserver en boks til lav pris.
      </Text>

      <View style={styles.v8} />
      <AppButton
        title="Se tilbud"
        variant="primary"
        onPress={() => navigation.navigate("Offers")}
      />
      <View style={styles.v8} />
      <AppButton title="Reserveret tilbud" variant="outline" onPress={() => navigation.navigate("ReservedOffers")} />
      
      <View style={styles.v8} />
      <AppButton
        title="Min profil"
        variant="secondary"
        onPress={() => navigation.navigate("Profile")}
      />

      <View style={styles.v8} />
      <AppButton
        title="Info"
        variant="outline"
        onPress={() => navigation.navigate("Info")}
      />



      <View style={styles.v16} />
      <Text style={styles.helperText}>
        Tip: Tilbud opdateres i løbet af eftermiddagen. Afhent inden for det angivne tidsrum.
      </Text>
    </View>
  );
}
