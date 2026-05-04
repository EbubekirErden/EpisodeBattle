import { useMemo, useState } from "react";

import { EPISODES } from "@/data/doctorwho/episodes";
import { BattleScreen } from "@/screens/BattleScreen";
import { ResultsScreen } from "@/screens/ResultsScreen";
import { createTournament, voteForWinner } from "@/tournament/engine";
import { Episode, TournamentMode, TournamentState } from "@/tournament/types";

const POOL_SIZES = [16, 32, 64, 128];
const DEFAULT_POOL_SIZE = 16;
const DEFAULT_MODE: TournamentMode = "swiss";

export default function App() {
  const [poolSize, setPoolSize] = useState(DEFAULT_POOL_SIZE);
  const [mode, setMode] = useState<TournamentMode>(DEFAULT_MODE);

  const [tournament, setTournament] = useState<TournamentState>(() =>
    createTournament(EPISODES, DEFAULT_POOL_SIZE, DEFAULT_MODE)
  );

  const [history, setHistory] = useState<TournamentState[]>([]);

  const episodeById = useMemo(() => {
    const map: Record<string, Episode> = {};

    for (const episode of EPISODES) {
      map[episode.id] = episode;
    }

    return map;
  }, []);

  function restart(nextPoolSize = poolSize, nextMode = mode) {
    setPoolSize(nextPoolSize);
    setMode(nextMode);
    setTournament(createTournament(EPISODES, nextPoolSize, nextMode));
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

  if (tournament.phase === "results") {
    return (
      <ResultsScreen
        tournament={tournament}
        episodeById={episodeById}
        onRestart={() => restart()}
      />
    );
  }

  return (
    <BattleScreen
      tournament={tournament}
      episodeById={episodeById}
      poolSize={poolSize}
      poolSizes={POOL_SIZES}
      mode={mode}
      historyLength={history.length}
      onVote={handleVote}
      onUndo={undo}
      onRestart={restart}
    />
  );
}