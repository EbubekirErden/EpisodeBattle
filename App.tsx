import { useMemo, useState } from "react";

import { EPISODES } from "@/data/doctorwho/episodes";
import { BattleScreen } from "@/screens/BattleScreen";
import { ResultsScreen } from "@/screens/ResultsScreen";
import { StartScreen } from "@/screens/StartScreen";
import {
  createTournament,
  voteForGoldenAdvance,
  voteForWinner,
} from "@/tournament/engine";
import { Episode, TournamentMode, TournamentState } from "@/tournament/types";

const POOL_SIZES = [16, 32, 64, 128];
const PLAYER_COUNTS = [1, 2, 3, 4, 5, 6];
const DEFAULT_POOL_SIZE = 16;
const DEFAULT_MODE: TournamentMode = "swiss";
const DEFAULT_PLAYER_COUNT = 1;

type HistoryEntry = {
  tournament: TournamentState;
  goldenVotesRemaining: number;
};

export default function App() {
  const [poolSize, setPoolSize] = useState(DEFAULT_POOL_SIZE);
  const [mode, setMode] = useState<TournamentMode>(DEFAULT_MODE);
  const [playerCount, setPlayerCount] = useState(DEFAULT_PLAYER_COUNT);
  const [tournament, setTournament] = useState<TournamentState | null>(null);
  const [goldenVotesRemaining, setGoldenVotesRemaining] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const episodeById = useMemo(() => {
    const map: Record<string, Episode> = {};

    for (const episode of EPISODES) {
      map[episode.id] = episode;
    }

    return map;
  }, []);

  function startTournament() {
    setTournament(createTournament(EPISODES, poolSize, mode));
    setGoldenVotesRemaining(playerCount);
    setHistory([]);
  }

  function handleVote(winnerId: string) {
    if (!tournament) return;

    setHistory((previous) => [
      ...previous,
      { tournament, goldenVotesRemaining },
    ]);
    setTournament((current) =>
      current ? voteForWinner(current, winnerId) : current
    );
  }

  function handleGoldenVote() {
    if (!tournament || goldenVotesRemaining <= 0) return;

    setHistory((previous) => [
      ...previous,
      { tournament, goldenVotesRemaining },
    ]);
    setGoldenVotesRemaining((previous) => Math.max(0, previous - 1));
    setTournament((current) =>
      current ? voteForGoldenAdvance(current) : current
    );
  }

  function undo() {
    setHistory((previous) => {
      if (previous.length === 0) return previous;

      const lastEntry = previous[previous.length - 1];
      setTournament(lastEntry.tournament);
      setGoldenVotesRemaining(lastEntry.goldenVotesRemaining);

      return previous.slice(0, -1);
    });
  }

  function returnToSetup() {
    setTournament(null);
    setGoldenVotesRemaining(0);
    setHistory([]);
  }

  if (!tournament) {
    return (
      <StartScreen
        poolSize={poolSize}
        poolSizes={POOL_SIZES}
        playerCount={playerCount}
        playerCounts={PLAYER_COUNTS}
        mode={mode}
        onSelectPoolSize={setPoolSize}
        onSelectPlayerCount={setPlayerCount}
        onSelectMode={setMode}
        onPlay={startTournament}
      />
    );
  }

  if (tournament.phase === "results") {
    return (
      <ResultsScreen
        tournament={tournament}
        episodeById={episodeById}
        onRestart={returnToSetup}
      />
    );
  }

  return (
    <BattleScreen
      tournament={tournament}
      episodeById={episodeById}
      poolSize={poolSize}
      mode={mode}
      goldenVotesRemaining={goldenVotesRemaining}
      historyLength={history.length}
      onVote={handleVote}
      onGoldenVote={handleGoldenVote}
      onUndo={undo}
      onRestart={startTournament}
      onNewTournament={returnToSetup}
    />
  );
}
