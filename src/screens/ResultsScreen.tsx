import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "@/styles/appStyles";
import { Episode, TournamentState } from "@/tournament/types";
import { rankEpisodes } from "@/tournament/engine";
import { formatEpisode } from "@/utils/formatEpisode";

type ResultsScreenProps = {
  tournament: TournamentState;
  episodeById: Record<string, Episode>;
  onRestart: () => void;
};

export function ResultsScreen({
  tournament,
  episodeById,
  onRestart,
}: ResultsScreenProps) {
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

      <TouchableOpacity style={styles.primaryButton} onPress={onRestart}>
        <Text style={styles.primaryButtonText}>Start Again</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}