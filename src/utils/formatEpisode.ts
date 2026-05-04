import { Episode } from "@/tournament/types";

export function formatEpisode(episode: Episode): string {
  return `S${String(episode.season).padStart(2, "0")}E${String(
    episode.episode
  ).padStart(2, "0")} - ${episode.title}`;
}

export function formatEpisodeCode(episode: Episode): string {
  return `S${String(episode.season).padStart(2, "0")}E${String(
    episode.episode
  ).padStart(2, "0")}`;
}