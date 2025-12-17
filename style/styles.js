// style/styles.js
import { StyleSheet } from "react-native";

const palette = {
  // Brand
  primary: "#1D6142",          // Green Pea – primær CTA
  primaryHover: "#144933",     // Forest – pressed/hover
  secondary: "#FF9A8A",        // Peachy Pink – sekundær CTA/badges
  secondaryHover: "#FF7F6A",   // Peach hover

  // Backgrounds
  bgCream: "#FFF4E9",          // Cream baggrund/flader
  bgSage: "#E6F0EC",           // Sage tint (subtle sektioner)
  bgSubtle: "#F6F7F7",

  // Neutrals
  title: "#111111",            // Neutral-900 – titler/kontrast
  text: "#374151",             // Ink – brødtekst
  muted: "#9CA3AF",            // Neutral-400 – sekundær tekst
  card: "#FFFFFF",
  border: "#E5E7EB",

  // Semantics
  info: "#1B8A7D",             // Teal – links/info
  warning: "#FDB022",          // Amber
  error: "#D33A2C",            // Coral
  errorTint: "#FDECEA",
};

export default StyleSheet.create({
  // Layout & tekst
  container: { flex: 1, padding: 20, backgroundColor: palette.bgCream },
  title: { fontSize: 26, fontWeight: "800", color: palette.title, marginBottom: 12, letterSpacing: 0.2 },
  emptyContainer: { justifyContent: "center", paddingHorizontal: 24 },
  headerBlock: { marginBottom: 14 },
  listContent: { paddingBottom: 24 },
  separator10: { height: 10 },

  // Home typografi
  appTitle: { fontSize: 30, fontWeight: "900", color: palette.title, marginBottom: 6, letterSpacing: 0.3 },
  subtitle: { color: palette.muted, marginBottom: 12, fontSize: 14, lineHeight: 20 },
  helperText: { color: palette.muted, fontSize: 12, lineHeight: 18 },

  // Kort
  card: {
    backgroundColor: palette.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(17,17,17,0.05)",
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardRow: { flexDirection: "row", gap: 12 },
  cardTitle: { fontSize: 18, fontWeight: "800", color: palette.title, marginBottom: 6, letterSpacing: 0.2 },
  cardLine: { color: palette.muted, marginBottom: 4 },

  // Knapper
  button: {
    marginTop: 10,
    alignSelf: "flex-start",
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800", letterSpacing: 0.2 },
  btnDisabled: { backgroundColor: "#E5E7EB" }, // lys grå baggrund
  btnDisabledText: { color: "#9CA3AF", fontWeight: "700" }, // grå tekst

  // Badges (sekundær som default)
  badge: {
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.secondary,
  },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  // Chips
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6, marginBottom: 6 },
  chip: {
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bgSage,
  },
  chipText: { color: palette.text, fontSize: 12 },

  // Layout-rækker
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  // Filterbar
  filterBar: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  filterBtn: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: palette.title,
    borderColor: palette.title,
  },
  filterText: { color: palette.title, fontWeight: "600", fontSize: 12 },
  filterTextActive: { color: "#fff" },

  // Input
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: "#fff",
    marginBottom: 12,
    color: palette.text,
  },

  // --- Auth Screens (Login/Signup) ---
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bgCream,
    padding: 24,
  },
  authCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: palette.card,
    borderRadius: 18,
    padding: 26,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  switchModeButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    alignItems: "center",
  },
  switchModeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // --- Info skærmen ---
  infoContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bgCream,
    padding: 24,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 26,
    maxWidth: 420,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginVertical: 40,
  },

  infoText: {
    fontSize: 15,
    color: palette.text,
    lineHeight: 22,
    marginBottom: 12,
    textAlign: "justify",
  },

  infoHighlight: {
    fontSize: 16,
    color: palette.primary,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  btn: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnFull: { width: "100%" },

  // Primary
  btnPrimary: { backgroundColor: palette.primary },
  btnPrimaryPressed: { opacity: 0.92 },
  btnPrimaryText: { color: "#fff", fontWeight: "800", letterSpacing: 0.2 },

  // Secondary (Peachy Pink)
  btnSecondary: { backgroundColor: palette.secondary },
  btnSecondaryPressed: { opacity: 0.92 },
  btnSecondaryText: { color: "#fff", fontWeight: "800", letterSpacing: 0.2 },

  // Outline / Neutral
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: "rgba(17,17,17,0.08)",
  },
  btnOutlinePressed: { backgroundColor: palette.bgSubtle },
  btnOutlineText: { color: palette.title, fontWeight: "800", letterSpacing: 0.2 },

  // Spacing helper
  v8: { height: 8 },
  v16: { height: 16 },
  imageThumb: { width: 72, height: 72, borderRadius: 10 },


  // Log ud knap (separat, så vi kan lave hover/pressed)
  logoutButton: {
    marginTop: 24,
    alignSelf: "flex-start",
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#9CA3AF", // grå
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonHover: {
    backgroundColor: "#6B7280", // lidt mørkere grå ved hover/tryk
  },

  profileActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  profileActionLeft: {
    flex: 1,
    marginRight: 8,
  },
  profileActionRight: {
    flex: 1,
    marginLeft: 8,
  },



    // --- Modal (Pop-up vindue) til slet profil ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    color: "#111111",
  },
  modalText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 8,
  },
  modalButtonSecondary: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalButtonSecondaryText: {
    color: "#111111",
    fontWeight: "600",
  },
  modalButtonDanger: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D33A2C",
  },
  modalButtonDangerText: {
    color: "#fff",
    fontWeight: "700",
  },


});


