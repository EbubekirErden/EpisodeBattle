import {
  Episode,
  Match,
  Standing,
  TournamentState,
} from "./types";

function getMaxSwissRounds(poolSize: number): number {
  if (poolSize <= 16) return 4;
  return 5;
}

export function createTournament(
  episodes: Episode[],
  poolSize: number
): TournamentState {
  const selectedEpisodes = [...episodes]
    .sort((a, b) => b.seedScore - a.seedScore)
    .slice(0, poolSize);

  const episodeIds = selectedEpisodes.map((episode) => episode.id);

  const standings: Record<string, Standing> = {};

  for (const episode of selectedEpisodes) {
    standings[episode.id] = {
      episodeId: episode.id,
      wins: 0,
      losses: 0,
      opponents: [],
      beatenOpponents: [],
      seedScore: episode.seedScore,
    };
  }

  const initialState: TournamentState = {
    phase: "swiss",
    poolSize,
    maxSwissRounds: getMaxSwissRounds(poolSize),
    currentSwissRound: 1,

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
    currentMatches: generateSwissMatches(initialState),
  };
}

export function getCurrentMatch(state: TournamentState): Match | null {
  if (state.phase !== "swiss" && state.phase !== "final") {
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

  return handleFinalVote(state, winnerId);
}

function handleSwissVote(
  state: TournamentState,
  winnerId: string,
  loserId: string
): TournamentState {
  const standings = cloneStandings(state.standings);

  standings[winnerId].wins += 1;
  standings[winnerId].opponents.push(loserId);
  standings[winnerId].beatenOpponents.push(loserId);

  standings[loserId].losses += 1;
  standings[loserId].opponents.push(winnerId);

  const nextMatchIndex = state.currentMatchIndex + 1;

  if (nextMatchIndex < state.currentMatches.length) {
    return {
      ...state,
      standings,
      currentMatchIndex: nextMatchIndex,
    };
  }

  const nextRound = state.currentSwissRound + 1;

  if (nextRound <= state.maxSwissRounds) {
    const nextState: TournamentState = {
      ...state,
      standings,
      currentSwissRound: nextRound,
      currentMatchIndex: 0,
    };

    return {
      ...nextState,
      currentMatches: generateSwissMatches(nextState),
    };
  }

  return startFinals({
    ...state,
    standings,
  });
}

function handleFinalVote(
  state: TournamentState,
  winnerId: string
): TournamentState {
  const nextMatchIndex = state.currentMatchIndex + 1;

  if (state.finalStage === "semifinals") {
    const semifinalWinners = [...state.semifinalWinners, winnerId];

    if (semifinalWinners.length < 2) {
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
  const finalists = rankEpisodes(state).slice(0, 4);

  return {
    ...state,
    phase: "final",
    finalStage: "semifinals",
    finalists,
    semifinalWinners: [],
    currentMatches: [
      {
        aId: finalists[0],
        bId: finalists[3],
      },
      {
        aId: finalists[1],
        bId: finalists[2],
      },
    ],
    currentMatchIndex: 0,
  };
}

export function rankEpisodes(state: TournamentState): string[] {
  return [...state.episodeIds].sort((aId, bId) => {
    const a = state.standings[aId];
    const b = state.standings[bId];

    if (b.wins !== a.wins) return b.wins - a.wins;

    const bOpponentStrength = getOpponentStrength(b, state.standings);
    const aOpponentStrength = getOpponentStrength(a, state.standings);

    if (bOpponentStrength !== aOpponentStrength) {
      return bOpponentStrength - aOpponentStrength;
    }

    return b.seedScore - a.seedScore;
  });
}

function generateSwissMatches(state: TournamentState): Match[] {
  const sortedIds = rankEpisodes(state);
  const unpaired = new Set(sortedIds);
  const matches: Match[] = [];

  while (unpaired.size > 1) {
    const aId = unpaired.values().next().value as string;
    unpaired.delete(aId);

    const bId = findBestOpponent(aId, [...unpaired], state);

    if (!bId) {
      break;
    }

    unpaired.delete(bId);

    matches.push({
      aId,
      bId,
    });
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

    const bWinDiff = Math.abs(a.wins - b.wins);
    const cWinDiff = Math.abs(a.wins - c.wins);

    if (bWinDiff !== cWinDiff) {
      return bWinDiff - cWinDiff;
    }

    return c.seedScore - b.seedScore;
  });

  return sortedCandidates[0] ?? null;
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