import { StyleSheet } from "react-native";

import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 18,
  },

  appTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
    letterSpacing: 0.5,
  },

  roundTitle: {
    color: colors.accent,
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  poolSelector: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 14,
  },

  poolButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },

  poolButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  poolButtonText: {
    color: colors.muted,
    fontWeight: "800",
  },

  poolButtonTextActive: {
    color: colors.background,
  },

  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  topCard: {
    borderColor: colors.topAccent,
  },

  bottomCard: {
    borderColor: colors.bottomAccent,
  },

  cardLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: 18,
  },

  topCardLabel: {
    color: colors.topAccent,
  },

  bottomCardLabel: {
    color: colors.bottomAccent,
  },

  episodeCode: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },

  episodeTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  vs: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 10,
    letterSpacing: 2,
  },

  footer: {
    marginTop: 14,
    gap: 10,
  },

  progressText: {
    color: colors.muted,
    textAlign: "center",
    fontWeight: "800",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: colors.surface,
  },

  secondaryButtonText: {
    color: colors.text,
    fontWeight: "900",
  },

  disabled: {
    opacity: 0.4,
  },

  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
  },

  primaryButtonText: {
    color: colors.background,
    fontWeight: "900",
    fontSize: 16,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 12,
  },

  championBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.accent,
    marginTop: 24,
  },

  label: {
    color: colors.accent,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  championTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },

  resultsList: {
    flex: 1,
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  rank: {
    color: colors.accent,
    width: 48,
    fontSize: 18,
    fontWeight: "900",
  },

  resultTextBox: {
    flex: 1,
  },

  resultTitle: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 15,
  },

  resultSub: {
    color: colors.muted,
    marginTop: 4,
    fontWeight: "800",
  },

  modeSelector: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 14,
  },

  modeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
  },

  modeButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  modeButtonText: {
    color: colors.muted,
    fontWeight: "900",
  },

  modeButtonTextActive: {
    color: colors.background,
  },
});