import { ImageSourcePropType } from "react-native";

export type Episode = {
  id: string;
  title: string;
  season: number;
  episode: number;
  seedScore: number;
  displayCode?: string;
  imdbRating?: number;
  imdbVotes?: number;
  year?: number;
  image?: ImageSourcePropType;
};

export type TournamentMode = "swiss" | "doubleDown";

export type Standing = {
  episodeId: string;
  wins: number;
  losses: number;
  opponents: string[];
  beatenOpponents: string[];
  seedScore: number;
  drawOrder: number;
};

export type Match = {
  aId: string;
  bId: string;
};

export type TournamentPhase = "swiss" | "doubleDown" | "final" | "results";

export type FinalStage = "semifinals" | "championship";

export type TournamentState = {
  mode: TournamentMode;
  phase: TournamentPhase;

  poolSize: number;
  maxSwissRounds: number;
  currentRound: number;

  eliminationLosses: number;

  episodeIds: string[];
  standings: Record<string, Standing>;

  currentMatches: Match[];
  currentMatchIndex: number;

  finalStage: FinalStage | null;
  finalists: string[];
  semifinalWinners: string[];
  championId: string | null;
};
