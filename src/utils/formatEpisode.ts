import { Episode } from "@/tournament/types";

export function formatEpisode(episode: Episode): string {
  return `${formatEpisodeCode(episode)} - ${episode.title}`;
}

export function formatEpisodeCode(episode: Episode): string {
  if (episode.displayCode) {
    return episode.displayCode;
  }

  return `S${String(episode.season).padStart(2, "0")}E${String(
    episode.episode
  ).padStart(2, "0")}`;
}