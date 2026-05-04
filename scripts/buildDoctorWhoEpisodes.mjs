import fs from "fs";
import path from "path";
import zlib from "zlib";
import readline from "readline";

const PROJECT_ROOT = process.cwd();

const IMDB_DIR = path.join(PROJECT_ROOT, "data", "imdb");

const BASICS_FILE = path.join(IMDB_DIR, "title.basics.tsv.gz");
const EPISODE_FILE = path.join(IMDB_DIR, "title.episode.tsv.gz");
const RATINGS_FILE = path.join(IMDB_DIR, "title.ratings.tsv.gz");

const OUTPUT_FILE = path.join(
  PROJECT_ROOT,
  "src",
  "data",
  "doctorwho",
  "episodes.ts"
);

// Doctor Who revival series, 2005-2022 IMDb parent title.
const DOCTOR_WHO_2005_PARENT_ID = "tt0436992";

function assertFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
}

async function readGzipTsv(filePath, onRow) {
  const stream = fs.createReadStream(filePath).pipe(zlib.createGunzip());

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let headers = null;

  for await (const line of rl) {
    if (!headers) {
      headers = line.split("\t");
      continue;
    }

    const values = line.split("\t");
    const row = {};

    for (let i = 0; i < headers.length; i += 1) {
      row[headers[i]] = values[i];
    }

    await onRow(row);
  }
}

function parseNullableInt(value) {
  if (!value || value === "\\N") return null;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNullableFloat(value) {
  if (!value || value === "\\N") return null;

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function median(numbers) {
  if (numbers.length === 0) return 1000;

  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middle];
  }

  return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

function getDisplayCode(season, episode) {
  if (season === null && episode === null) return "Special";

  if (season !== null && episode === null) {
    return `S${String(season).padStart(2, "0")} Special`;
  }

  if (season !== null && episode === 0) {
    return `S${String(season).padStart(2, "0")} Special`;
  }

  return undefined;
}

function getEpisodeId(tconst) {
  return `dw2005_${tconst}`;
}

function getSeedScore(rating, votes, averageRating, voteBaseline) {
  if (rating === null || votes === null) {
    return Number((averageRating * 10).toFixed(2));
  }

  const weightedRating =
    (votes / (votes + voteBaseline)) * rating +
    (voteBaseline / (votes + voteBaseline)) * averageRating;

  return Number((weightedRating * 10).toFixed(2));
}

async function main() {
  assertFileExists(BASICS_FILE);
  assertFileExists(EPISODE_FILE);
  assertFileExists(RATINGS_FILE);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

  console.log("Reading Doctor Who 2005 episode links...");

  const episodeMeta = new Map();

  await readGzipTsv(EPISODE_FILE, (row) => {
    if (row.parentTconst !== DOCTOR_WHO_2005_PARENT_ID) {
      return;
    }

    episodeMeta.set(row.tconst, {
      tconst: row.tconst,
      season: parseNullableInt(row.seasonNumber),
      episode: parseNullableInt(row.episodeNumber),
    });
  });

  console.log(`Found ${episodeMeta.size} episode rows.`);

  console.log("Reading ratings...");

  const ratings = new Map();

  await readGzipTsv(RATINGS_FILE, (row) => {
    if (!episodeMeta.has(row.tconst)) {
      return;
    }

    ratings.set(row.tconst, {
      imdbRating: parseNullableFloat(row.averageRating),
      imdbVotes: parseNullableInt(row.numVotes),
    });
  });

  const knownRatings = [...ratings.values()]
    .map((item) => item.imdbRating)
    .filter((value) => value !== null);

  const knownVotes = [...ratings.values()]
    .map((item) => item.imdbVotes)
    .filter((value) => value !== null);

  const averageRating =
    knownRatings.length > 0
      ? knownRatings.reduce((total, value) => total + value, 0) /
        knownRatings.length
      : 7.5;

  const voteBaseline = median(knownVotes);

  console.log(`Average rating: ${averageRating.toFixed(2)}`);
  console.log(`Vote baseline: ${voteBaseline}`);

  console.log("Reading episode titles...");

  const episodes = [];

  await readGzipTsv(BASICS_FILE, (row) => {
    if (!episodeMeta.has(row.tconst)) {
      return;
    }

    if (row.titleType !== "tvEpisode") {
      return;
    }

    const meta = episodeMeta.get(row.tconst);

    const rating = ratings.get(row.tconst) ?? {
      imdbRating: null,
      imdbVotes: null,
    };

    const season = meta.season ?? 0;
    const episode = meta.episode ?? 0;

    episodes.push({
      id: getEpisodeId(row.tconst),
      title: row.primaryTitle,
      season,
      episode,
      seedScore: getSeedScore(
        rating.imdbRating,
        rating.imdbVotes,
        averageRating,
        voteBaseline
      ),
      displayCode: getDisplayCode(meta.season, meta.episode),
      imdbRating: rating.imdbRating ?? undefined,
      imdbVotes: rating.imdbVotes ?? undefined,
      year: parseNullableInt(row.startYear) ?? undefined,
    });
  });

  episodes.sort((a, b) => {
    if ((a.year ?? 9999) !== (b.year ?? 9999)) {
      return (a.year ?? 9999) - (b.year ?? 9999);
    }

    if (a.season !== b.season) {
      return a.season - b.season;
    }

    if (a.episode !== b.episode) {
      return a.episode - b.episode;
    }

    return a.title.localeCompare(b.title);
  });

  const output = `import { Episode } from "@/tournament/types";

export const EPISODES: Episode[] = ${JSON.stringify(episodes, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, output, "utf8");

  console.log(`Wrote ${episodes.length} episodes to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});