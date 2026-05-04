import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

import { EPISODES } from "@/data/doctorwho/episodes";
import { Episode } from "@/tournament/types";
import { styles } from "@/styles/appStyles";
import {
  createTournament,
  getCurrentMatch,
  rankEpisodes,
  voteForWinner,
} from "@/tournament/engine";

const POOL_SIZES = [16, 32, 64];

export default function App() {
  const [poolSize, setPoolSize] = useState(16);
  const [tournament, setTournament] = useState(() =>
    createTournament(EPISODES, 16)
  );

  const [history, setHistory] = useState<typeof tournament[]>([]);

  const episodeById = useMemo(() => {
    const map: Record<string, Episode> = {};

    for (const episode of EPISODES) {
      map[episode.id] = episode;
    }

    return map;
  }, []);

  const currentMatch = getCurrentMatch(tournament);

  function restart(size = poolSize) {
    setPoolSize(size);
    setTournament(createTournament(EPISODES, size));
    setHistory([]);
  }

  function handleVote(winnerId: string) {
    setHistory((previous) => [...previous, tournament]);
    setTournament((current) => voteForWinner(current, winnerId));
  }

  function undo() {
    setHistory((previous) => {
      if (previous.length === 0) return previous;

      const lastState = previous[previous.length - 1];
      setTournament(lastState);

      return previous.slice(0, -1);
    });
  }

  const title =
    tournament.phase === "swiss"
      ? `Swiss Round ${tournament.currentSwissRound}/${tournament.maxSwissRounds}`
      : tournament.phase === "final" && tournament.finalStage === "semifinals"
      ? "Final 4 - Semifinals"
      : tournament.phase === "final"
      ? "Championship Final"
      : "Results";

  if (tournament.phase === "results") {
    const rankedIds = rankEpisodes(tournament);
    const champion = tournament.championId
      ? episodeById[tournament.championId]
      : null;

    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.appTitle}>Episode Battle</Text>

        <View style={styles.championBox}>
          <Text style={styles.label}>Champion</Text>
          <Text style={styles.championTitle}>
            {champion ? formatEpisode(champion) : "Unknown"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Swiss Ranking</Text>

        <ScrollView style={styles.resultsList}>
          {rankedIds.map((episodeId, index) => {
            const episode = episodeById[episodeId];
            const standing = tournament.standings[episodeId];

            return (
              <View key={episodeId} style={styles.resultRow}>
                <Text style={styles.rank}>#{index + 1}</Text>
                <View style={styles.resultTextBox}>
                  <Text style={styles.resultTitle}>{formatEpisode(episode)}</Text>
                  <Text style={styles.resultSub}>
                    {standing.wins}W - {standing.losses}L
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.primaryButton} onPress={() => restart()}>
          <Text style={styles.primaryButtonText}>Start Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!currentMatch) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.appTitle}>Episode Battle</Text>
        <Text style={styles.sectionTitle}>No match available.</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => restart()}>
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
      <Text style={styles.roundTitle}>{title}</Text>

      <View style={styles.poolSelector}>
        {POOL_SIZES.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.poolButton,
              poolSize === size && styles.poolButtonActive,
            ]}
            onPress={() => restart(size)}
          >
            <Text
              style={[
                styles.poolButtonText,
                poolSize === size && styles.poolButtonTextActive,
              ]}
            >
              Top {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <EpisodeCard
        episode={topEpisode}
        label="TOP"
        onPress={() => handleVote(topEpisode.id)}
      />

      <Text style={styles.vs}>VS</Text>

      <EpisodeCard
        episode={bottomEpisode}
        label="BOTTOM"
        onPress={() => handleVote(bottomEpisode.id)}
      />

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          Match {tournament.currentMatchIndex + 1}/
          {tournament.currentMatches.length}
        </Text>

        <TouchableOpacity
          style={[styles.secondaryButton, history.length === 0 && styles.disabled]}
          onPress={undo}
          disabled={history.length === 0}
        >
          <Text style={styles.secondaryButtonText}>Undo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function EpisodeCard({
  episode,
  label,
  onPress,
}: {
  episode: Episode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.cardLabel}>{label} WINS</Text>
      <Text style={styles.episodeCode}>
        S{String(episode.season).padStart(2, "0")}E
        {String(episode.episode).padStart(2, "0")}
      </Text>
      <Text style={styles.episodeTitle}>{episode.title}</Text>
    </TouchableOpacity>
  );
}

function formatEpisode(episode: Episode): string {
  return `S${String(episode.season).padStart(2, "0")}E${String(
    episode.episode
  ).padStart(2, "0")} - ${episode.title}`;
}
