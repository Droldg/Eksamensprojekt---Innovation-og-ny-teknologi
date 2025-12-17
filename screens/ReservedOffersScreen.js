import { View, Text, FlatList, Image, Pressable } from "react-native";
import styles from "../style/styles";
import { useReservations } from "../context/ReservationsContext";

function ItemCard({ item, onCancel }) {
  return (
    <View style={[styles.card, styles.headerBlock]}>
      <View style={styles.cardRow}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.imageThumb} />
        ) : null}

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>

          {item.pickupWindow ? (
            <Text style={styles.cardLine}>Afhentning: {item.pickupWindow}</Text>
          ) : null}

          {item.price != null ? (
            <Text style={styles.cardLine}>Pris: {item.price} kr</Text>
          ) : null}

          {Array.isArray(item.items) && item.items.length > 0 ? (
            <View style={styles.chipRow}>
              {item.items.map((x, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{x}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.v8} />
      <Pressable
        style={({ pressed }) => [
          styles.btn,
          styles.btnOutline,
          pressed && styles.btnOutlinePressed,
        ]}
        onPress={() => onCancel(item.id)}
        android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      >
        <Text style={styles.btnOutlineText}>Annullér reservation</Text>
      </Pressable>
    </View>
  );
}

export default function ReservedOffersScreen({ navigation }) {
  const { items, remove, clear } = useReservations();

  // TOM TILSTAND — hvid rubrik (samme som infosiden)
  if (!items.length) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <View style={styles.infoCard}>
          <Text style={styles.title}>Ingen reserverede tilbud endnu</Text>
          <Text style={styles.infoText}>
            Når du reserverer fra “Tilbud”, dukker de op her. Vis reservationen ved afhentning.
          </Text>

          <View style={styles.v8} />
          <Pressable
            onPress={() => navigation.navigate("Offers")}
            style={({ pressed }) => [
              styles.btn,
              styles.btnPrimary,
              pressed && styles.btnPrimaryPressed,
            ]}
            android_ripple={{ color: "rgba(0,0,0,0.06)" }}
          >
            <Text style={styles.btnPrimaryText}>Gå til tilbud</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // LISTE MED RESERVATIONER
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(x) => String(x.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator10} />}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Dine reservationer</Text>
            <Text style={styles.helperText}>
              Vis frem ved afhentning. Du kan annullere her i appen.
            </Text>

            <View style={styles.v8} />
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                styles.btnSecondary,
                pressed && styles.btnSecondaryPressed,
              ]}
              onPress={clear}
              android_ripple={{ color: "rgba(0,0,0,0.06)" }}
            >
              <Text style={styles.btnSecondaryText}>Ryd alle</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => <ItemCard item={item} onCancel={remove} />}
      />
    </View>
  );
}
