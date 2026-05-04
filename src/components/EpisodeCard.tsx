import { Image, Text, TouchableOpacity, View } from "react-native";

import { styles } from "@/styles/appStyles";
import { Episode } from "@/tournament/types";
import { formatEpisodeCode } from "@/utils/formatEpisode";

type EpisodeCardVariant = "top" | "bottom";

type EpisodeCardProps = {
  episode: Episode;
  label: string;
  variant: EpisodeCardVariant;
  onPress: () => void;
};

export function EpisodeCard({
  episode,
  label,
  variant,
  onPress,
}: EpisodeCardProps) {
  const cardVariantStyle =
    variant === "top" ? styles.topCard : styles.bottomCard;

  const labelVariantStyle =
    variant === "top" ? styles.topCardLabel : styles.bottomCardLabel;

  return (
    <TouchableOpacity
      style={[styles.card, cardVariantStyle]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {episode.image ? (
        <Image source={episode.image} style={styles.episodeImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            {formatEpisodeCode(episode)}
          </Text>
        </View>
      )}

      <View style={styles.cardTextBox}>
        <Text style={[styles.cardLabel, labelVariantStyle]}>{label} WINS</Text>
        <Text style={styles.episodeCode}>{formatEpisodeCode(episode)}</Text>
        <Text style={styles.episodeTitle}>{episode.title}</Text>
      </View>
    </TouchableOpacity>
  );
}