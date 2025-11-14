// screens/OffersScreen.js
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, Platform } from "react-native";
import styles from "../style/styles";
import { useReservations } from "../context/ReservationsContext";

const seedOffers = [
  { id: "1", title: "Pastaboks", items: ["Pasta", "Tomatsauce", "Salat"], price: 15, pickup: "15:30-16:30", qty: 3 },
  { id: "2", title: "Vegetarboks", items: ["Grønt", "Hummus", "Brød"], price: 12, pickup: "15:30-16:00", qty: 0 },
  { id: "3", title: "Smørrebrød mix", items: ["Æg/rejer", "Frikadelle", "Kartoffel"], price: 20, pickup: "14:45-15:30", qty: 6 },
  { id: "4", title: "Suppe + brød", items: ["Tomatsuppe", "Flüte"], price: 10, pickup: "15:00-16:00", qty: 4 },
  { id: "5", title: "Salatbowl", items: ["Kylling", "Quinoa", "Dressing"], price: 18, pickup: "15:15-16:15", qty: 2 },
  { id: "6", title: "Wokboks", items: ["Nudler", "Grøntsager", "Soja"], price: 16, pickup: "15:20-16:20", qty: 5 },
  { id: "7", title: "Lasagne", items: ["Oksekød", "Ost", "Salat"], price: 22, pickup: "15:30-16:30", qty: 1 },
  { id: "8", title: "Dessertboks", items: ["Cheesecake", "Frugt"], price: 8, pickup: "15:30-16:00", qty: 7 },
];

export default function OffersScreen() {
  const [offers, setOffers] = useState(seedOffers);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [reservedIds, setReservedIds] = useState(new Set()); // <- NYT
  const { add } = useReservations();

  const list = useMemo(
    () => offers.filter((o) => (onlyAvailable ? o.qty > 0 : true)),
    [offers, onlyAvailable]
  );

  const reserve = (offer) => {
    // hvis allerede reserveret, gør ingenting
    if (reservedIds.has(offer.id)) return;

    // 1) -1 på qty lokalt
    setOffers((prev) =>
      prev.map((o) => (o.id === offer.id && o.qty > 0 ? { ...o, qty: o.qty - 1 } : o))
    );

    // 2) Tilføj til global reservationsliste
    add({
      id: offer.id,
      title: offer.title,
      price: offer.price,
      pickupWindow: offer.pickup,
      items: offer.items,
    });

    // 3) Markér som reserveret (disable knappen for bruger)
    setReservedIds((prev) => {
      const next = new Set(prev);
      next.add(offer.id);
      return next;
    });
  };

  const badgeBg = (qty) => (qty > 0 ? "#1D6142" : "#D33A2C");

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
