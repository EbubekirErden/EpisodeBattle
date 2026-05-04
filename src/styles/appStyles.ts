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
    marginBottom: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  startHero: {
    marginTop: 56,
    marginBottom: 34,
    alignItems: "center",
  },

  startSubtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 320,
    fontWeight: "700",
  },

  setupPanel: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 24,
    paddingHorizontal: 18,
    gap: 22,
  },

  setupGroup: {
    gap: 12,
  },

  setupLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },

  matchupEstimateBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  matchupEstimateLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  matchupEstimateValue: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },

  poolSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 0,
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
    padding: 12,
    justifyContent: "flex-start",
    alignItems: "stretch",

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

  topCardSelected: {
    backgroundColor: colors.topGlowSurface,
    borderColor: colors.topAccent,
    shadowColor: colors.topAccent,
    shadowOpacity: 0.7,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 10,
    transform: [{ scale: 0.985 }],
  },

  bottomCardSelected: {
    backgroundColor: colors.bottomGlowSurface,
    borderColor: colors.bottomAccent,
    shadowColor: colors.bottomAccent,
    shadowOpacity: 0.7,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 10,
    transform: [{ scale: 0.985 }],
  },

  episodeCode: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
  },

  episodeTitle: {
    color: colors.text,
    fontSize: 22,
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
    marginTop: 10,
    gap: 8,
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

  playButton: {
    backgroundColor: colors.accent,
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 22,
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },

  playButtonText: {
    color: colors.background,
    fontWeight: "900",
    fontSize: 17,
    letterSpacing: 0.2,
  },

  ghostButton: {
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 12,
  },

  ghostButtonText: {
    color: colors.muted,
    fontWeight: "900",
  },

  ghostButtonConfirming: {
    backgroundColor: colors.dangerSurface,
  },

  ghostButtonTextConfirming: {
    color: colors.danger,
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
    marginBottom: 0,
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

  episodeImageFrame: {
    flex: 1,
    minHeight: 0,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: colors.surfaceElevated,
    overflow: "hidden",
  },

  episodeImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    width: "100%",
    aspectRatio: 500 / 281,
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  imagePlaceholderText: {
    color: colors.muted,
    fontSize: 28,
    fontWeight: "900",
  },

  cardTextBox: {
    alignItems: "center",
    flexShrink: 0,
  },
});
