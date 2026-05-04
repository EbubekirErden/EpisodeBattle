import { Image, Pressable, Text, View } from "react-native";

import { styles } from "@/styles/appStyles";
import { Episode } from "@/tournament/types";
import { formatEpisodeCode } from "@/utils/formatEpisode";

type EpisodeCardVariant = "top" | "bottom";

type EpisodeCardProps = {
  episode: Episode;
  variant: EpisodeCardVariant;
  onPress: () => void;
};

export function EpisodeCard({
  episode,
  variant,
  onPress,
}: EpisodeCardProps) {
  const cardVariantStyle =
    variant === "top" ? styles.topCard : styles.bottomCard;

  const selectedCardStyle =
    variant === "top" ? styles.topCardSelected : styles.bottomCardSelected;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        cardVariantStyle,
        pressed && selectedCardStyle,
      ]}
      onPress={onPress}
    >
      {episode.image ? (
        <View style={styles.episodeImageFrame}>
          <Image
            source={episode.image}
            style={styles.episodeImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            {formatEpisodeCode(episode)}
          </Text>
        </View>
      )}

      <View style={styles.cardTextBox}>
        <Text style={styles.episodeCode} numberOfLines={1}>
          {formatEpisodeCode(episode)}
        </Text>
        <Text
          style={styles.episodeTitle}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
        >
          {episode.title}
        </Text>
      </View>
    </Pressable>
  );
}
