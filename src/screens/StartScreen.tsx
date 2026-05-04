import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { ModeSelector } from "@/components/ModeSelector";
import { PoolSelector } from "@/components/PoolSelector";
import { styles } from "@/styles/appStyles";
import { TournamentMode } from "@/tournament/types";

type StartScreenProps = {
  poolSize: number;
  poolSizes: number[];
  mode: TournamentMode;
  onSelectPoolSize: (poolSize: number) => void;
  onSelectMode: (mode: TournamentMode) => void;
  onPlay: () => void;
};

export function StartScreen({
  poolSize,
  poolSizes,
  mode,
  onSelectPoolSize,
  onSelectMode,
  onPlay,
}: StartScreenProps) {
  const matchupEstimate = getMatchupEstimate(poolSize, mode);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.startHero}>
        <Text style={styles.appTitle}>Episode Battle</Text>
        <Text style={styles.startSubtitle}>
          Choose your bracket, then let the impossible decisions begin.
        </Text>
      </View>

      <View style={styles.setupPanel}>
        <View style={styles.setupGroup}>
          <Text style={styles.setupLabel}>Tournament Size</Text>
          <PoolSelector
            poolSizes={poolSizes}
            selectedPoolSize={poolSize}
            onSelectSize={onSelectPoolSize}
          />
        </View>

        <View style={styles.setupGroup}>
          <Text style={styles.setupLabel}>Mode</Text>
          <ModeSelector selectedMode={mode} onSelectMode={onSelectMode} />
          <View style={styles.modeInfoPanel}>
            <Text style={styles.modeInfoText}>{getModeInfo(mode)}</Text>
          </View>
        </View>

        <View style={styles.matchupEstimateBox}>
          <Text style={styles.matchupEstimateLabel}>Estimated Matchups</Text>
          <Text style={styles.matchupEstimateValue}>{matchupEstimate}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={onPlay}>
        <Text style={styles.playButtonText}>Play Tournament</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function getMatchupEstimate(
  poolSize: number,
  mode: TournamentMode
): string {
  if (mode === "swiss") {
    const swissRounds = poolSize <= 16 ? 4 : 5;
    const matchups = Math.floor(poolSize / 2) * swissRounds + 3;

    return `${matchups}`;
  }

  if (mode === "knockout") {
    return `${poolSize - 1}`;
  }

  const doubleDownEstimates: Record<number, string> = {
    16: "31",
    32: "63",
    64: "126-128",
    128: "254-256",
  };

  return doubleDownEstimates[poolSize] ?? "Depends on eliminations";
}

function getModeInfo(mode: TournamentMode): string {
  if (mode === "swiss") {
    return "Fixed rounds, then the strongest four move to finals.";
  }

  if (mode === "knockout") {
    return "Fast bracket. One loss and an episode is out.";
  }

  return "More forgiving bracket. Episodes are out after two losses.";
}
