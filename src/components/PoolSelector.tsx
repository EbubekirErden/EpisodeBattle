import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "@/styles/appStyles";

type PoolSelectorProps = {
  poolSizes: number[];
  selectedPoolSize: number;
  onSelectSize: (size: number) => void;
};

export function PoolSelector({
  poolSizes,
  selectedPoolSize,
  onSelectSize,
}: PoolSelectorProps) {
  return (
    <View style={styles.poolSelector}>
      {poolSizes.map((size) => {
        const isActive = selectedPoolSize === size;

        return (
          <TouchableOpacity
            key={size}
            style={[styles.poolButton, isActive && styles.poolButtonActive]}
            onPress={() => onSelectSize(size)}
          >
            <Text
              style={[
                styles.poolButtonText,
                isActive && styles.poolButtonTextActive,
              ]}
            >
              Top {size}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}