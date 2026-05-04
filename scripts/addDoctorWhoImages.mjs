import "dotenv/config";

import fs from "fs";
import path from "path";

const PROJECT_ROOT = process.cwd();

const EPISODES_FILE = path.join(
  PROJECT_ROOT,
  "src",
  "data",
  "doctorwho",
  "episodes.ts"
);

const ASSET_DIR = path.join(PROJECT_ROOT, "assets", "doctorwho");

const TMDB_SERIES_ID = 57243;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!TMDB_ACCESS_TOKEN) {
  console.error("Missing TMDB_ACCESS_TOKEN in .env");
  process.exit(1);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readEpisodesFromTsFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  const match = content.match(
    /export const EPISODES: Episode\[\] = ([\s\S]*?);\s*$/
  );

  if (!match) {
    throw new Error("Could not find EPISODES array in episodes.ts");
  }

  return JSON.parse(match[1]);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTitle(value) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titleMatches(a, b) {
  const normalizedA = normalizeTitle(a);
  const normalizedB = normalizeTitle(b);

  return (
    normalizedA === normalizedB ||
    normalizedA.includes(normalizedB) ||
    normalizedB.includes(normalizedA)
  );
}

function getImageFileName(episode) {
  const code = episode.displayCode
    ? slugify(episode.displayCode)
    : `s${String(episode.season).padStart(2, "0")}e${String(
        episode.episode
      ).padStart(2, "0")}`;

  return `${code}-${slugify(episode.title)}.jpg`;
}

function getEpisodeImageRelativeRequirePath(episode) {
  return `../../../assets/doctorwho/${getImageFileName(episode)}`;
}

async function tmdbGetJson(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `TMDb request failed: ${response.status} ${response.statusText}\n${url}\n${text}`
    );
  }

  return response.json();
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status} ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(outputPath, buffer);
}

function chooseBestStill(stills) {
  if (!Array.isArray(stills) || stills.length === 0) {
    return null;
  }

  const sorted = [...stills].sort((a, b) => {
    const bVotes = b.vote_count ?? 0;
    const aVotes = a.vote_count ?? 0;

    if (bVotes !== aVotes) return bVotes - aVotes;

    const bAverage = b.vote_average ?? 0;
    const aAverage = a.vote_average ?? 0;

    if (bAverage !== aAverage) return bAverage - aAverage;

    const bSize = (b.width ?? 0) * (b.height ?? 0);
    const aSize = (a.width ?? 0) * (a.height ?? 0);

    return bSize - aSize;
  });

  return sorted[0];
}

async function getSeasonDetails(seasonNumber) {
  const url = `https://api.themoviedb.org/3/tv/${TMDB_SERIES_ID}/season/${seasonNumber}`;
  return tmdbGetJson(url);
}

async function getEpisodeImages(seasonNumber, episodeNumber) {
  const url =
    `https://api.themoviedb.org/3/tv/${TMDB_SERIES_ID}` +
    `/season/${seasonNumber}` +
    `/episode/${episodeNumber}` +
    `/images?include_image_language=en,null`;

  const data = await tmdbGetJson(url);
  return data.stills ?? [];
}

function findMatchingSpecial(episode, specials) {
  return specials.find((special) => titleMatches(special.name, episode.title));
}

async function getStillPathNormalFirst(episode, specials) {
  const shouldTryNormal =
    episode.season !== 0 && episode.episode !== 0 && episode.episode !== null;

  if (shouldTryNormal) {
    try {
      const normalStills = await getEpisodeImages(
        episode.season,
        episode.episode
      );

      const normalStill = chooseBestStill(normalStills);

      if (normalStill?.file_path) {
        return {
          filePath: normalStill.file_path,
          source: `S${episode.season}E${episode.episode}`,
        };
      }
    } catch (error) {
      console.log(
        `NORMAL LOOKUP FAILED ${episode.title}: trying season 0 fallback`
      );
    }
  }

  const matchingSpecial = findMatchingSpecial(episode, specials);

  if (!matchingSpecial) {
    return null;
  }

  const specialStills = await getEpisodeImages(0, matchingSpecial.episode_number);
  const specialStill = chooseBestStill(specialStills);

  if (!specialStill?.file_path) {
    return null;
  }

  return {
    filePath: specialStill.file_path,
    source: `S0E${matchingSpecial.episode_number}`,
  };
}

function buildEpisodesTs(episodes) {
  const lines = [];

  lines.push(`import { Episode } from "@/tournament/types";`);
  lines.push("");
  lines.push("export const EPISODES: Episode[] = [");

  for (const episode of episodes) {
    lines.push("  {");
    lines.push(`    id: ${JSON.stringify(episode.id)},`);
    lines.push(`    title: ${JSON.stringify(episode.title)},`);
    lines.push(`    season: ${episode.season},`);
    lines.push(`    episode: ${episode.episode},`);
    lines.push(`    seedScore: ${episode.seedScore},`);

    if (episode.displayCode) {
      lines.push(`    displayCode: ${JSON.stringify(episode.displayCode)},`);
    }

    if (episode.imdbRating !== undefined) {
      lines.push(`    imdbRating: ${episode.imdbRating},`);
    }

    if (episode.imdbVotes !== undefined) {
      lines.push(`    imdbVotes: ${episode.imdbVotes},`);
    }

    if (episode.year !== undefined) {
      lines.push(`    year: ${episode.year},`);
    }

    if (episode.localImagePath) {
      lines.push(
        `    image: require(${JSON.stringify(episode.localImagePath)}),`
      );
    }

    lines.push("  },");
  }

  lines.push("];");
  lines.push("");

  return lines.join("\n");
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  ensureDir(ASSET_DIR);

  const episodes = readEpisodesFromTsFile(EPISODES_FILE);

  console.log(`Loaded ${episodes.length} episodes.`);
  console.log("Loading TMDb season 0 specials...");

  const seasonZero = await getSeasonDetails(0);
  const specials = seasonZero.episodes ?? [];

  console.log(`Loaded ${specials.length} TMDb specials.`);

  let downloadedCount = 0;
  let skippedCount = 0;
  let missingCount = 0;

  for (const episode of episodes) {
    const fileName = getImageFileName(episode);
    const outputPath = path.join(ASSET_DIR, fileName);
    const relativeRequirePath = getEpisodeImageRelativeRequirePath(episode);

    if (fs.existsSync(outputPath)) {
      episode.localImagePath = relativeRequirePath;
      skippedCount += 1;
      console.log(`SKIP existing ${fileName}`);
      continue;
    }

    try {
      const stillResult = await getStillPathNormalFirst(episode, specials);

      if (!stillResult) {
        missingCount += 1;
        console.log(
          `NO IMAGE ${episode.displayCode ?? `S${episode.season}E${episode.episode}`} - ${episode.title}`
        );
        continue;
      }

      const imageUrl = `${TMDB_IMAGE_BASE_URL}${stillResult.filePath}`;

      await downloadFile(imageUrl, outputPath);

      episode.localImagePath = relativeRequirePath;
      downloadedCount += 1;

      console.log(
        `DOWNLOADED ${fileName} from ${stillResult.source} - ${episode.title}`
      );

      await sleep(250);
    } catch (error) {
      missingCount += 1;
      console.error(
        `FAILED ${episode.displayCode ?? `S${episode.season}E${episode.episode}`} - ${episode.title}`
      );
      console.error(error.message);
    }
  }

  fs.writeFileSync(EPISODES_FILE, buildEpisodesTs(episodes), "utf8");

  console.log("");
  console.log("Done.");
  console.log(`Downloaded: ${downloadedCount}`);
  console.log(`Skipped existing: ${skippedCount}`);
  console.log(`Missing/failed: ${missingCount}`);
  console.log(`Updated: ${EPISODES_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});