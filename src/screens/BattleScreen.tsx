import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { EpisodeCard } from "@/components/EpisodeCard";
import { PoolSelector } from "@/components/PoolSelector";
import { styles } from "@/styles/appStyles";
import { Episode, TournamentState } from "@/tournament/types";
import { getCurrentMatch } from "@/tournament/engine";

type BattleScreenProps = {
  tournament: TournamentState;
  episodeById: Record<string, Episode>;
  poolSize: number;
  poolSizes: number[];
  historyLength: number;
  onVote: (winnerId: string) => void;
  onUndo: () => void;
  onRestart: (poolSize?: number) => void;
};

export function BattleScreen({
  tournament,
  episodeById,
  poolSize,
  poolSizes,
  historyLength,
  onVote,
  onUndo,
  onRestart,
}: BattleScreenProps) {
  const currentMatch = getCurrentMatch(tournament);

  if (!currentMatch) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.appTitle}>Episode Battle</Text>
        <Text style={styles.sectionTitle}>No match available.</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onRestart()}
        >
          <Text style={styles.primaryButtonText}>Restart</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const topEpisode = episodeById[currentMatch.aId];
  const bottomEpisode = episodeById[currentMatch.bId];

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.appTitle}>Episode Battle</Text>
      <Text style={styles.roundTitle}>{getTournamentTitle(tournament)}</Text>

      <PoolSelector
        poolSizes={poolSizes}
        selectedPoolSize={poolSize}
        onSelectSize={onRestart}
      />

      <EpisodeCard
        episode={topEpisode}
        label="TOP"
        variant="top"
        onPress={() => onVote(topEpisode.id)}
      />

      <Text style={styles.vs}>VS</Text>

      <EpisodeCard
        episode={bottomEpisode}
        label="BOTTOM"
        variant="bottom"
        onPress={() => onVote(bottomEpisode.id)}
      />

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          Match {tournament.currentMatchIndex + 1}/
          {tournament.currentMatches.length}
        </Text>

        <TouchableOpacity
          style={[styles.secondaryButton, historyLength === 0 && styles.disabled]}
          onPress={onUndo}
          disabled={historyLength === 0}
        >
          <Text style={styles.secondaryButtonText}>Undo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function getTournamentTitle(tournament: TournamentState): string {
  if (tournament.phase === "swiss") {
    return `Swiss Round ${tournament.currentSwissRound}/${tournament.maxSwissRounds}`;
  }

  if (tournament.phase === "final" && tournament.finalStage === "semifinals") {
    return "Final 4 - Semifinals";
  }

  if (tournament.phase === "final") {
    return "Championship Final";
  }

  return "Episode Battle";
}