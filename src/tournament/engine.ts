import {
  Episode,
  Match,
  Standing,
  TournamentMode,
  TournamentState,
} from "@/tournament/types";

const DOUBLE_DOWN_LOSSES = 2;

function getMaxSwissRounds(poolSize: number): number {
  if (poolSize <= 16) return 4;
  return 5;
}

export function createTournament(
  episodes: Episode[],
  poolSize: number,
  mode: TournamentMode
): TournamentState {
  const selectedEpisodes = shuffleEpisodes(
    [...episodes]
      .filter(isPlayableEpisode)
      .sort((a, b) => b.seedScore - a.seedScore)
      .slice(0, poolSize)
  );

  const actualPoolSize = selectedEpisodes.length;
  const episodeIds = selectedEpisodes.map((episode) => episode.id);

  const standings: Record<string, Standing> = {};

  selectedEpisodes.forEach((episode, drawOrder) => {
    standings[episode.id] = {
      episodeId: episode.id,
      wins: 0,
      losses: 0,
      opponents: [],
      beatenOpponents: [],
      seedScore: episode.seedScore,
      drawOrder,
    };
  });

  const initialState: TournamentState = {
    mode,
    phase: mode,

    poolSize: actualPoolSize,
    maxSwissRounds: getMaxSwissRounds(actualPoolSize),
    currentRound: 1,

    eliminationLosses: DOUBLE_DOWN_LOSSES,

    episodeIds,
    standings,

    currentMatches: [],
    currentMatchIndex: 0,

    finalStage: null,
    finalists: [],
    semifinalWinners: [],
    championId: null,
  };

  return {
    ...initialState,
    currentMatches:
      mode === "swiss"
        ? generateSwissMatches(initialState)
        : generateDoubleDownMatches(initialState),
  };
}

export function getCurrentMatch(state: TournamentState): Match | null {
  if (
    state.phase !== "swiss" &&
    state.phase !== "doubleDown" &&
    state.phase !== "final"
  ) {
    return null;
  }

  return state.currentMatches[state.currentMatchIndex] ?? null;
}

export function voteForWinner(
  state: TournamentState,
  winnerId: string
): TournamentState {
  const match = getCurrentMatch(state);

  if (!match) {
    return state;
  }

  const loserId = match.aId === winnerId ? match.bId : match.aId;

  if (state.phase === "swiss") {
    return handleSwissVote(state, winnerId, loserId);
  }

  if (state.phase === "doubleDown") {
    return handleDoubleDownVote(state, winnerId, loserId);
  }

  return handleFinalVote(state, winnerId);
}

function handleSwissVote(
  state: TournamentState,
  winnerId: string,
  loserId: string
): TournamentState {
  const standings = applyMatchResult(state.standings, winnerId, loserId);

  const afterVoteState: TournamentState = {
    ...state,
    standings,
  };

  const nextMatchIndex = state.currentMatchIndex + 1;

  if (nextMatchIndex < state.currentMatches.length) {
    return {
      ...afterVoteState,
      currentMatchIndex: nextMatchIndex,
    };
  }

  if (state.currentRound >= state.maxSwissRounds) {
    return startFinals(afterVoteState);
  }

  const nextRoundState: TournamentState = {
    ...afterVoteState,
    currentRound: state.currentRound + 1,
    currentMatchIndex: 0,
  };

  return {
    ...nextRoundState,
    currentMatches: generateSwissMatches(nextRoundState),
  };
}

function handleDoubleDownVote(
  state: TournamentState,
  winnerId: string,
  loserId: string
): TournamentState {
  const standings = applyMatchResult(state.standings, winnerId, loserId);

  const afterVoteState: TournamentState = {
    ...state,
    standings,
  };

  const nextMatchIndex = state.currentMatchIndex + 1;

  if (nextMatchIndex < state.currentMatches.length) {
    return {
      ...afterVoteState,
      currentMatchIndex: nextMatchIndex,
    };
  }

  const activeIds = getActiveEpisodeIds(afterVoteState);

  if (activeIds.length <= 4) {
    return startFinals(afterVoteState);
  }

  const nextRoundState: TournamentState = {
    ...afterVoteState,
    currentRound: state.currentRound + 1,
    currentMatchIndex: 0,
  };

  const nextMatches = generateDoubleDownMatches(nextRoundState);

  if (nextMatches.length === 0) {
    return startFinals(nextRoundState);
  }

  return {
    ...nextRoundState,
    currentMatches: nextMatches,
  };
}

function handleFinalVote(
  state: TournamentState,
  winnerId: string
): TournamentState {
  if (state.finalStage === "semifinals") {
    const semifinalWinners = [...state.semifinalWinners, winnerId];
    const nextMatchIndex = state.currentMatchIndex + 1;

    if (nextMatchIndex < state.currentMatches.length) {
      return {
        ...state,
        semifinalWinners,
        currentMatchIndex: nextMatchIndex,
      };
    }

    return {
      ...state,
      finalStage: "championship",
      semifinalWinners,
      currentMatches: [
        {
          aId: semifinalWinners[0],
          bId: semifinalWinners[1],
        },
      ],
      currentMatchIndex: 0,
    };
  }

  return {
    ...state,
    phase: "results",
    championId: winnerId,
  };
}

function startFinals(state: TournamentState): TournamentState {
  const rankedIds = rankEpisodes(state);

  const activeFinalists = rankedIds.filter((episodeId) =>
    isActiveEpisode(state, episodeId)
  );

  const backupFinalists = rankedIds.filter(
    (episodeId) => !activeFinalists.includes(episodeId)
  );

  const finalists = [...activeFinalists, ...backupFinalists].slice(0, 4);

  if (finalists.length <= 1) {
    return {
      ...state,
      phase: "results",
      championId: finalists[0] ?? null,
    };
  }

  if (finalists.length === 2) {
    return {
      ...state,
      phase: "final",
      finalStage: "championship",
      finalists,
      semifinalWinners: [],
      currentMatches: [{ aId: finalists[0], bId: finalists[1] }],
      currentMatchIndex: 0,
    };
  }

  if (finalists.length === 3) {
    return {
      ...state,
      phase: "final",
      finalStage: "semifinals",
      finalists,
      semifinalWinners: [finalists[0]],
      currentMatches: [{ aId: finalists[1], bId: finalists[2] }],
      currentMatchIndex: 0,
    };
  }

  return {
    ...state,
    phase: "final",
    finalStage: "semifinals",
    finalists,
    semifinalWinners: [],
    currentMatches: [
      { aId: finalists[0], bId: finalists[3] },
      { aId: finalists[1], bId: finalists[2] },
    ],
    currentMatchIndex: 0,
  };
}

export function rankEpisodes(state: TournamentState): string[] {
  return [...state.episodeIds].sort((aId, bId) => {
    const a = state.standings[aId];
    const b = state.standings[bId];

    const aActive = isActiveEpisode(state, aId);
    const bActive = isActiveEpisode(state, bId);

    if (state.mode === "doubleDown" && aActive !== bActive) {
      return aActive ? -1 : 1;
    }

    if (b.wins !== a.wins) return b.wins - a.wins;

    if (a.losses !== b.losses) return a.losses - b.losses;

    const bOpponentStrength = getOpponentStrength(b, state.standings);
    const aOpponentStrength = getOpponentStrength(a, state.standings);

    if (bOpponentStrength !== aOpponentStrength) {
      return bOpponentStrength - aOpponentStrength;
    }

    return b.seedScore - a.seedScore;
  });
}

function generateSwissMatches(state: TournamentState): Match[] {
  const sortedIds = rankEpisodesForPairing(state);
  return pairEpisodeIds(sortedIds, state);
}

function generateDoubleDownMatches(state: TournamentState): Match[] {
  const activeIds = getActiveEpisodeIds(state);

  const sortedActiveIds = activeIds.sort((aId, bId) => {
    const a = state.standings[aId];
    const b = state.standings[bId];

    if (a.losses !== b.losses) return a.losses - b.losses;
    if (b.wins !== a.wins) return b.wins - a.wins;

    return a.drawOrder - b.drawOrder;
  });

  return pairEpisodeIds(sortedActiveIds, state);
}

function rankEpisodesForPairing(state: TournamentState): string[] {
  return [...state.episodeIds].sort((aId, bId) => {
    const a = state.standings[aId];
    const b = state.standings[bId];

    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;

    const bOpponentStrength = getOpponentStrength(b, state.standings);
    const aOpponentStrength = getOpponentStrength(a, state.standings);

    if (bOpponentStrength !== aOpponentStrength) {
      return bOpponentStrength - aOpponentStrength;
    }

    return a.drawOrder - b.drawOrder;
  });
}

function pairEpisodeIds(ids: string[], state: TournamentState): Match[] {
  const idsForPairing = [...ids];

  if (idsForPairing.length % 2 === 1) {
    idsForPairing.pop();
  }

  const unpaired = new Set(idsForPairing);
  const matches: Match[] = [];

  while (unpaired.size > 1) {
    const aId = unpaired.values().next().value as string;
    unpaired.delete(aId);

    const bId = findBestOpponent(aId, [...unpaired], state);

    if (!bId) break;

    unpaired.delete(bId);

    matches.push({ aId, bId });
  }

  return matches;
}

function findBestOpponent(
  aId: string,
  candidates: string[],
  state: TournamentState
): string | null {
  const a = state.standings[aId];

  const sortedCandidates = candidates.sort((bId, cId) => {
    const b = state.standings[bId];
    const c = state.standings[cId];

    const bHasPlayed = a.opponents.includes(bId);
    const cHasPlayed = a.opponents.includes(cId);

    if (bHasPlayed !== cHasPlayed) {
      return bHasPlayed ? 1 : -1;
    }

    const bLossDiff = Math.abs(a.losses - b.losses);
    const cLossDiff = Math.abs(a.losses - c.losses);

    if (bLossDiff !== cLossDiff) {
      return bLossDiff - cLossDiff;
    }

    const bWinDiff = Math.abs(a.wins - b.wins);
    const cWinDiff = Math.abs(a.wins - c.wins);

    if (bWinDiff !== cWinDiff) {
      return bWinDiff - cWinDiff;
    }

    return b.drawOrder - c.drawOrder;
  });

  return sortedCandidates[0] ?? null;
}

function applyMatchResult(
  standings: Record<string, Standing>,
  winnerId: string,
  loserId: string
): Record<string, Standing> {
  const copy = cloneStandings(standings);

  copy[winnerId].wins += 1;
  copy[winnerId].opponents.push(loserId);
  copy[winnerId].beatenOpponents.push(loserId);

  copy[loserId].losses += 1;
  copy[loserId].opponents.push(winnerId);

  return copy;
}

function getActiveEpisodeIds(state: TournamentState): string[] {
  return state.episodeIds.filter((episodeId) =>
    isActiveEpisode(state, episodeId)
  );
}

function isActiveEpisode(state: TournamentState, episodeId: string): boolean {
  if (state.mode !== "doubleDown") return true;

  return state.standings[episodeId].losses < state.eliminationLosses;
}

function getOpponentStrength(
  standing: Standing,
  standings: Record<string, Standing>
): number {
  return standing.opponents.reduce((total, opponentId) => {
    return total + standings[opponentId].wins;
  }, 0);
}

function cloneStandings(
  standings: Record<string, Standing>
): Record<string, Standing> {
  const copy: Record<string, Standing> = {};

  for (const [episodeId, standing] of Object.entries(standings)) {
    copy[episodeId] = {
      ...standing,
      opponents: [...standing.opponents],
      beatenOpponents: [...standing.beatenOpponents],
    };
  }

  return copy;
}

function isPlayableEpisode(episode: Episode): boolean {
  return Boolean(episode.image);
}

function shuffleEpisodes(episodes: Episode[]): Episode[] {
  const shuffled = [...episodes];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];

    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = current;
  }

  return shuffled;
}
