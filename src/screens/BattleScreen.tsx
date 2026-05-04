import { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { EpisodeCard } from "@/components/EpisodeCard";
import { styles } from "@/styles/appStyles";
import { getCurrentMatch } from "@/tournament/engine";
import {
  Episode,
  TournamentMode,
  TournamentState,
} from "@/tournament/types";

type BattleScreenProps = {
  tournament: TournamentState;
  episodeById: Record<string, Episode>;
  poolSize: number;
  mode: TournamentMode;
  goldenVotesRemaining: number;
  historyLength: number;
  onVote: (winnerId: string) => void;
  onGoldenVote: () => void;
  onUndo: () => void;
  onRestart: (poolSize?: number, mode?: TournamentMode) => void;
  onNewTournament: () => void;
};

export function BattleScreen({
  tournament,
  episodeById,
  poolSize,
  mode,
  goldenVotesRemaining,
  historyLength,
  onVote,
  onGoldenVote,
  onUndo,
  onRestart,
  onNewTournament,
}: BattleScreenProps) {
  const [isConfirmingNewTournament, setIsConfirmingNewTournament] =
    useState(false);

  const currentMatch = getCurrentMatch(tournament);

  if (!currentMatch) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.appTitle}>Episode Battle</Text>
        <Text style={styles.sectionTitle}>No match available.</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onRestart(poolSize, mode)}
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

      <EpisodeCard
        episode={topEpisode}
        variant="top"
        onPress={() => {
          setIsConfirmingNewTournament(false);
          onVote(topEpisode.id);
        }}
      />

      <Text style={styles.vs}>VS</Text>

      <EpisodeCard
        episode={bottomEpisode}
        variant="bottom"
        onPress={() => {
          setIsConfirmingNewTournament(false);
          onVote(bottomEpisode.id);
        }}
      />

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          {getProgressText(tournament)}
        </Text>

        <TouchableOpacity
          style={[
            styles.goldenVoteButton,
            goldenVotesRemaining === 0 && styles.disabled,
          ]}
          onPress={() => {
            setIsConfirmingNewTournament(false);
            onGoldenVote();
          }}
          disabled={goldenVotesRemaining === 0}
        >
          <Text style={styles.goldenVoteButtonText}>
            Golden Vote ({goldenVotesRemaining} left)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            historyLength === 0 && styles.disabled,
          ]}
          onPress={() => {
            setIsConfirmingNewTournament(false);
            onUndo();
          }}
          disabled={historyLength === 0}
        >
          <Text style={styles.secondaryButtonText}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.ghostButton,
            isConfirmingNewTournament && styles.ghostButtonConfirming,
          ]}
          onPress={() => {
            if (isConfirmingNewTournament) {
              onNewTournament();
              return;
            }

            setIsConfirmingNewTournament(true);
          }}
        >
          <Text
            style={[
              styles.ghostButtonText,
              isConfirmingNewTournament && styles.ghostButtonTextConfirming,
            ]}
          >
            {isConfirmingNewTournament
              ? "Tap again to start new tournament"
              : "New Tournament"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function getTournamentTitle(tournament: TournamentState): string {
  if (tournament.phase === "swiss") {
    return `Swiss Round ${tournament.currentRound}/${tournament.maxSwissRounds}`;
  }

  if (tournament.phase === "doubleDown") {
    return `Double Down Round ${tournament.currentRound}`;
  }

  if (tournament.phase === "knockout") {
    return `Knockout Round ${tournament.currentRound}`;
  }

  if (tournament.phase === "final" && tournament.finalStage === "semifinals") {
    return "Final 4 - Semifinals";
  }

  if (tournament.phase === "final") {
    return "Championship Final";
  }

  return "Episode Battle";
}

function getProgressText(tournament: TournamentState): string {
  const matchNumber = tournament.currentMatchIndex + 1;
  const totalMatches = tournament.currentMatches.length;

  if (tournament.phase === "doubleDown" || tournament.phase === "knockout") {
    const activeCount = getActiveCount(tournament);

    return `Match ${matchNumber}/${totalMatches} • ${activeCount} alive`;
  }

  return `Match ${matchNumber}/${totalMatches}`;
}

function getActiveCount(tournament: TournamentState): number {
  return tournament.episodeIds.filter((episodeId) => {
    const standing = tournament.standings[episodeId];

    return standing.losses < tournament.eliminationLosses;
  }).length;
}
