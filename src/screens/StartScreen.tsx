import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { ModeSelector } from "@/components/ModeSelector";
import { PoolSelector } from "@/components/PoolSelector";
import { styles } from "@/styles/appStyles";
import { TournamentMode } from "@/tournament/types";

type StartScreenProps = {
  poolSize: number;
  poolSizes: number[];
  mode: TournamentMode;
  onSelectPoolSize: (poolSize: number) => void;
  onSelectMode: (mode: TournamentMode) => void;
  onPlay: () => void;
};

export function StartScreen({
  poolSize,
  poolSizes,
  mode,
  onSelectPoolSize,
  onSelectMode,
  onPlay,
}: StartScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.startHero}>
        <Text style={styles.appTitle}>Episode Battle</Text>
        <Text style={styles.startSubtitle}>
          Choose your bracket, then let the impossible decisions begin.
        </Text>
      </View>

      <View style={styles.setupPanel}>
        <Text style={styles.setupLabel}>Tournament Size</Text>
        <PoolSelector
          poolSizes={poolSizes}
          selectedPoolSize={poolSize}
          onSelectSize={onSelectPoolSize}
        />

        <Text style={styles.setupLabel}>Mode</Text>
        <ModeSelector selectedMode={mode} onSelectMode={onSelectMode} />
      </View>

      <TouchableOpacity style={styles.playButton} onPress={onPlay}>
        <Text style={styles.playButtonText}>Play Tournament</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
