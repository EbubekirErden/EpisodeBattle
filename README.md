# Episode Battle

Episode Battle is an Expo + React Native app for running head-to-head episode tournaments. The current build is centered on the 2005-2022 era of *Doctor Who*, letting players compare episodes in a fast mobile-friendly bracket flow and crown a champion.

The app supports multiple tournament formats, configurable pool sizes, local multiplayer-style voting, episode artwork, and a final ranking screen powered by a custom tournament engine.

## Highlights

- Three tournament modes: `swiss`, `doubleDown`, and `knockout`
- Configurable episode pools: `16`, `32`, `64`, or `128`
- `1` to `6` players with shared "golden votes"
- Undo support for the current session
- Episode cards with cover art and metadata-driven seeding
- Finals flow that narrows the field to a Final Four and championship result

## Tournament Modes

### Swiss

Each round pairs episodes based on current performance. Every episode gets multiple matches, and the strongest four advance to the finals.

### Double Down

Episodes stay alive until they lose twice. This mode is more forgiving than a single-elimination bracket and works well for larger pools.

### Knockout

Single elimination. One loss and the episode is out.

## Tech Stack

- Expo `54`
- React `19`
- React Native `0.81`
- TypeScript

## Project Structure

```text
.
├── App.tsx                         # App state and screen switching
├── assets/doctorwho/               # Episode artwork
├── scripts/                        # Dataset and image maintenance scripts
├── src/components/                 # Reusable UI components
├── src/data/doctorwho/episodes.ts  # Doctor Who episode dataset
├── src/screens/                    # Start, battle, and results screens
├── src/styles/                     # Shared styling and color tokens
├── src/tournament/                 # Tournament engine and types
└── src/utils/                      # Formatting helpers
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Expo Go or a local iOS/Android simulator

### Installation

```bash
npm install
```

### Run The App

```bash
npm start
```

Useful shortcuts:

```bash
npm run ios
npm run android
npm run web
```

## How It Works

1. Choose a tournament size, player count, and mode.
2. Start the tournament and vote between two episode cards at a time.
3. Use a golden vote to let both episodes survive a matchup.
4. Continue through rounds until the finals determine a champion.
5. Review the final rankings on the results screen.

## Data And Assets

Episode Battle ships with a curated dataset in [src/data/doctorwho/episodes.ts](/Users/ebubekirerden/Documents/VSCode/EpisodeBattle/src/data/doctorwho/episodes.ts:1). Each episode includes fields such as title, season, episode number, year, IMDb-derived metrics, and a `seedScore` used for tournament selection and ordering.

The repository also includes two maintenance scripts:

- [scripts/buildDoctorWhoEpisodes.mjs](/Users/ebubekirerden/Documents/VSCode/EpisodeBattle/scripts/buildDoctorWhoEpisodes.mjs:1) builds the dataset from IMDb TSV exports stored under `data/imdb/`.
- [scripts/addDoctorWhoImages.mjs](/Users/ebubekirerden/Documents/VSCode/EpisodeBattle/scripts/addDoctorWhoImages.mjs:1) downloads episode stills from TMDb and rewrites the dataset with local image references.

### TMDb Token

The image import script expects a `.env` file with:

```env
TMDB_ACCESS_TOKEN=your_token_here
```

This token is only needed for the asset maintenance script. The app itself does not require runtime API access.

## Scripts

The project currently exposes these npm scripts:

```bash
npm start
npm run ios
npm run android
npm run web
```

The dataset utilities can be run directly with Node when needed:

```bash
node scripts/buildDoctorWhoEpisodes.mjs
node scripts/addDoctorWhoImages.mjs
```

## Notes

- Path aliases are configured through `@/* -> src/*`.
- The app is currently portrait-oriented.
- There is no automated test suite configured in this repository yet.

