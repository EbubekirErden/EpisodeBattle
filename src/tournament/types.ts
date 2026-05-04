export type Episode = {
  id: string;
  title: string;
  season: number;
  episode: number;
  seedScore: number;
};

export type Standing = {
  episodeId: string;
  wins: number;
  losses: number;
  opponents: string[];
  beatenOpponents: string[];
  seedScore: number;
};

export type Match = {
  aId: string;
  bId: string;
};

export type TournamentPhase = "setup" | "swiss" | "final" | "results";

export type FinalStage = "semifinals" | "championship";

export type TournamentState = {
  phase: TournamentPhase;

  poolSize: number;
  maxSwissRounds: number;
  currentSwissRound: number;

  episodeIds: string[];
  standings: Record<string, Standing>;

  currentMatches: Match[];
  currentMatchIndex: number;

  finalStage: FinalStage | null;
  finalists: string[];
  semifinalWinners: string[];
  championId: string | null;
};