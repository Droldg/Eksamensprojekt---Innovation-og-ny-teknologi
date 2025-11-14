// InfoScreen.js er en skærm, som har til formål at give brugeren information om appens koncept og formål.
import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import styles from "../style/styles";

export default function InfoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.infoContainer}>
      <View style={styles.infoCard}>
        <Text style={styles.title}>Om MadRedder</Text>

        <Text style={styles.infoText}>
          MadRedder hjælper med at <Text style={{ fontWeight: "700" }}>reducere madspild</Text> 
          i virksomheders kantiner ved at gøre overskudsmad synlig og let at reservere.
        </Text>

        <Text style={styles.infoText}>
          Kantinen kan nemt udgive dagens overskud med pris og afhentningstid, mens medarbejdere 
          hurtigt kan reservere en boks direkte i appen.
        </Text>

        <Text style={styles.infoHighlight}>
          Sammen kan vi mindske spild og gøre en forskel – én frokost ad gangen 🌱
        </Text>
      </View>
    </ScrollView>
  );
}

