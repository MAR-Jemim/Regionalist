# CP Roadmap

A personal competitive-programming roadmap, from toolchain setup to ICPC-regional topics,
with progress pulled live from the Codeforces API.

**91 topics across 7 tiers** &middot; dual C++ / Python templates &middot; 296 curated CSES + AtCoder
problems &middot; auto-generated Codeforces ladders &middot; weak-tag analysis.

No backend, no accounts, no build step. It is plain HTML, CSS and one JS file.

## Running it

The page fetches `data/*.json`, so it needs to be served over HTTP —
opening `index.html` directly with `file://` will fail.

```bash
python3 -m http.server 8000 --directory docs
```

(from the repo root) then open <http://localhost:8000>.

## Deploying to GitHub Pages

This folder is `docs/` inside the Regionalist repo. Pages serves it directly:

**Settings → Pages → Source: Deploy from a branch → `main` / `/docs`**

Live at `https://mar-jemim.github.io/Regionalist/`. The `.nojekyll` file is already
present so Pages serves the `data/` directory as-is.

## How progress works

| Source | How it is tracked |
|---|---|
| Codeforces problems | Auto-ticked from `user.status` — anything you have solved counts immediately |
| CSES / AtCoder | Ticked by hand (separate judges, no public API) |
| Whole topics | A "mark complete" button, for topics with no problem ladder |

A topic counts as complete at 10 solved problems in its rating band, or when marked by hand.
Everything is stored in `localStorage`, so it lives in one browser and never leaves your machine.

### The three Codeforces calls

- `problemset.problems` — all 11k rated problems, cached 7 days, compacted to ~600 KB
- `user.status` — your submissions, cached 15 minutes, reduced to a set of solved problem IDs
- `user.info` — current rating, used to highlight which tier you are actually in

All three are public and send `Access-Control-Allow-Origin: *`, so no proxy or key is needed.

### Ladder generation

Problem ladders are not hardcoded, so they never go stale. For each topic the app filters the
problemset by the topic's Codeforces tags intersected with its rating band, drops anything you
have already solved, and ranks by `solvedCount` — most-solved first, as a proxy for "canonical".

### Weak-tag analysis

For each tag, the app computes what share of the problems available in your practice band
(`rating − 100` to `rating + 300`) you have actually solved, then compares each tag against your
own median coverage. Tags well below your median are the ones you are avoiding.

## Editing content

All content lives in JSON — there is nothing to compile.

```
data/topics/t0.json … t6.json   one file per tier
data/curated.json               topic id -> hand-picked problems
```

A topic looks like this:

```jsonc
{
  "id": "binary-search-answer",
  "title": "Binary Search on the Answer",
  "tier": 2,
  "prereqs": ["builtin-algos", "complexity"],  // must be real topic ids
  "cfTags": ["binary search"],                 // drives the generated ladder
  "band": [1300, 1700],                        // rating range for the ladder
  "icpc": "high",                              // "high" shows an ICPC badge
  "why": "...",                                // supports **bold**, *italic*, `code`
  "traps": ["...", "..."],
  "template": { "cpp": "...", "py": "..." },
  "pyNote": "...",                             // optional Python-specific warning
  "checkpoint": "...",                         // "you may move on when..."
  "stub": true                                 // marks a topic as notes-pending
}
```

Tiers 0–4 have full notes. Tiers 5–6 are marked `"stub": true` — structure, prerequisites,
checkpoints and live ladders are in place, prose is not. Fill them in as you get there.

### Tiers

| Tier | Rating | Focus |
|---|---|---|
| 0 | — | Toolchain, complexity, containers, stress testing |
| 1 | <1200 | Implementation, sorting, greedy, brute force |
| 2 | 1200–1399 | Prefix sums, two pointers, binary search on the answer |
| 3 | 1400–1599 | Graphs, DP foundations, combinatorics |
| 4 | 1600–1899 | DP patterns, shortest paths, trees, DSU, ICPC strategy |
| 5 | 1900–2099 | Segment trees, strings, SCC, game theory |
| 6 | 2100+ | Flows, geometry, suffix structures, DP optimisation |
