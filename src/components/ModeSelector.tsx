import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "@/styles/appStyles";
import { TournamentMode } from "@/tournament/types";

type ModeSelectorProps = {
  selectedMode: TournamentMode;
  onSelectMode: (mode: TournamentMode) => void;
};

export function ModeSelector({
  selectedMode,
  onSelectMode,
}: ModeSelectorProps) {
  return (
    <View style={styles.modeSelector}>
      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === "swiss" && styles.modeButtonActive,
        ]}
        onPress={() => onSelectMode("swiss")}
      >
        <Text
          style={[
            styles.modeButtonText,
            selectedMode === "swiss" && styles.modeButtonTextActive,
          ]}
        >
          Swiss
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === "knockout" && styles.modeButtonActive,
        ]}
        onPress={() => onSelectMode("knockout")}
      >
        <Text
          style={[
            styles.modeButtonText,
            selectedMode === "knockout" && styles.modeButtonTextActive,
          ]}
        >
          Knockout
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === "doubleDown" && styles.modeButtonActive,
        ]}
        onPress={() => onSelectMode("doubleDown")}
      >
        <Text
          style={[
            styles.modeButtonText,
            selectedMode === "doubleDown" && styles.modeButtonTextActive,
          ]}
        >
          Double Down
        </Text>
      </TouchableOpacity>
    </View>
  );
}
