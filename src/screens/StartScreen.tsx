import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ModeSelector } from "@/components/ModeSelector";
import { PlayerSelector } from "@/components/PlayerSelector";
import { PoolSelector } from "@/components/PoolSelector";
import { styles } from "@/styles/appStyles";
import { TournamentMode } from "@/tournament/types";

type StartScreenProps = {
  poolSize: number;
  poolSizes: number[];
  playerCount: number;
  playerCounts: number[];
  mode: TournamentMode;
  onSelectPoolSize: (poolSize: number) => void;
  onSelectPlayerCount: (playerCount: number) => void;
  onSelectMode: (mode: TournamentMode) => void;
  onPlay: () => void;
};

export function StartScreen({
  poolSize,
  poolSizes,
  playerCount,
  playerCounts,
  mode,
  onSelectPoolSize,
  onSelectPlayerCount,
  onSelectMode,
  onPlay,
}: StartScreenProps) {
  const matchupEstimate = getMatchupEstimate(poolSize, mode);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.startContent}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.setupLabel}>Players</Text>
            <PlayerSelector
              playerCounts={playerCounts}
              selectedPlayerCount={playerCount}
              onSelectPlayerCount={onSelectPlayerCount}
            />
            <Text style={styles.setupHint}>
              {playerCount} golden vote{playerCount === 1 ? "" : "s"}.
              Use one to let both episodes survive a matchup.
            </Text>
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
      </ScrollView>
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
