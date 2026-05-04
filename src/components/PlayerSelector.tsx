import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "@/styles/appStyles";

type PlayerSelectorProps = {
  playerCounts: number[];
  selectedPlayerCount: number;
  onSelectPlayerCount: (playerCount: number) => void;
};

export function PlayerSelector({
  playerCounts,
  selectedPlayerCount,
  onSelectPlayerCount,
}: PlayerSelectorProps) {
  return (
    <View style={styles.poolSelector}>
      {playerCounts.map((playerCount) => {
        const isActive = selectedPlayerCount === playerCount;

        return (
          <TouchableOpacity
            key={playerCount}
            style={[styles.poolButton, isActive && styles.poolButtonActive]}
            onPress={() => onSelectPlayerCount(playerCount)}
          >
            <Text
              style={[
                styles.poolButtonText,
                isActive && styles.poolButtonTextActive,
              ]}
            >
              {playerCount}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
