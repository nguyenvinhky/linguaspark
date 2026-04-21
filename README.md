# LinguaSpark

> Personal English vocabulary learner for Vietnamese speakers — powered by Groq, built as a single HTML file, deploys from `git push`.

Type any English word and get real example sentences grouped by **chunk type** (idiom · discourse marker · phrasal verb · collocation · binomial · sentence stem · word), with Vietnamese translations, pronunciation, and a built-in **spaced-repetition review loop**. No accounts, no servers, no build tools.

[![Deploy app to GitHub Pages](https://github.com/nguyenvinhky/linguaspark/actions/workflows/deploy.yml/badge.svg)](https://github.com/nguyenvinhky/linguaspark/actions/workflows/deploy.yml)

---

## Why

Most dictionary apps give you **definitions**. LinguaSpark gives you **natural English in context** — and proactively surfaces the idioms, collocations, and discourse markers that contain the word you searched (the stuff you can't look up because you don't know it exists yet).

Type `story` → get 5 chunks you never learned (`long story short`, `the story goes that`, `a whole different story`, `story of my life`, `tell a story`) plus 8–10 sentences using them.

## Features

**Search & discovery**
- Any word or phrase → 1–3 definitions + 8–10 example sentences + a **"Chunks containing X"** drill-down section
- 14 context presets (Family, Work, Interview, Culture fit, Business, Meeting, Travel, School, Health, Food, Tech, Emotion, Friends, Daily) + free-text Custom
- Context chips auto-sort by usage with weekly time-decay; `N×` count badges
- 🎲 Random word — returns 3 context-appropriate picks with in-session repeat avoidance; keyboard shortcut `R`

**Learning loop**
- **Streak counter** with 7-day heatmap
- **SRS review** mode using the SM-2 algorithm (Again / Hard / Good / Easy with projected intervals). Keyboard-first: `Space` to reveal, `1`–`4` to rate, `Esc` to exit
- Auto-mastery when a card hits `reps ≥ 8 && interval ≥ 180d`
- Inline VN translations always visible; TTS via the browser's Web Speech API
- Opt-in daily browser notification at a user-chosen hour (fires while the tab is open)

**Data**
- Everything in `localStorage` — no backend, no analytics, no account
- Full backup export (JSON) + **Import via file picker or drag-and-drop anywhere on the window**
- "Safe" export that redacts your API key so the file is OK to share
- Reset chip ordering (one-click) vs. Clear all data (scorched earth) — both surfaced in Settings

**UI**
- Auto / light / dark theme with `prefers-color-scheme` + manual override
- Fraunces (display) + Inter (UI) + JetBrains Mono (IPA / stats)
- Responsive down to 375px; keyboard shortcuts (`⌘K` focus search, `R` random, `Space`/`1-4`/`Esc` in Review)

## Quick start

### Use the hosted version
Live at **https://nguyenvinhky.github.io/linguaspark/** once Pages is enabled (see below). Open → Settings → paste your Groq API key → done.

### Run locally (zero build)
```bash
git clone https://github.com/nguyenvinhky/linguaspark.git
cd linguaspark
# Option A — just double-click app/index.html
# Option B — serve it (needed if your browser restricts file:// for fetch)
python3 -m http.server --directory app 8000
# → http://localhost:8000
```

Grab a **free Groq API key** at [console.groq.com/keys](https://console.groq.com/keys) — 14,400 requests/day free tier, no credit card required.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Single HTML file, vanilla JS | No build tooling, runs from `file://` or any static host |
| Styling | Tailwind Play CDN | Fastest path from design mockup to working UI |
| LLM | Groq (`llama-3.3-70b-versatile`, switchable) | 500+ tokens/sec, generous free tier |
| Storage | `localStorage` | Sufficient for personal scale; survives refresh |
| TTS | Web Speech API | Zero install; uses whatever voices the OS ships |
| Deploy | GitHub Actions → GitHub Pages | `git push`, done |

## Data & privacy

- **Your Groq API key lives in `localStorage`** — never sent to anyone but Groq's API.
- The hosted version is served as static files; there is no server that sees your queries.
- If you export a backup, the key is **included by default** with a warning. Use "Export (no key)" to redact before sharing.
- Drag-and-drop import fully overwrites existing data after confirmation.
- Clear all data wipes every LinguaSpark key from localStorage and cancels scheduled notifications.

## Deploying your own fork

The workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publishes `app/` to GitHub Pages on every push to `main`.

One-time setup:
1. **Settings → Pages → Source**: select **"GitHub Actions"**
2. Push a commit that touches `app/**` or trigger the workflow manually

## Project layout

```
.
├── app/
│   └── index.html             # The working app — single file, ~2400 lines
├── design/
│   └── sentence-suggester/
│       ├── v1/                # Initial editorial mockup
│       ├── v2/                # Bento + command palette + compare + practice modes
│       ├── v3/                # Chunk-type badge system (current baseline)
│       ├── CHANGELOG.md
│       └── LATEST.md          # Always points at the current preview
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages deploy
├── CLAUDE.md                  # Repo conventions for the Claude Code agent
├── PLAN.md                    # Active feature plan (Context selector, done)
└── README.md                  # You are here
```

## Roadmap

Things the app already does well won't regress; these are candidate additions:

- [ ] **Service Worker** so daily reminders fire even when the tab is closed (requires hosted URL — done; just need the SW)
- [ ] **PWA manifest** so you can "Install app" on Windows / Mac / Android
- [ ] **Audio recording + pronunciation scoring** using `whisper-rs` WASM or Groq Whisper API
- [ ] **Tauri wrapper** for a ~10 MB desktop app with true background notifications

## License

MIT — use, fork, adapt freely. If you build something cool with it, a ⭐ is appreciated.

---

<sub>Built with [Claude Code](https://claude.com/claude-code). Design artifacts in `design/` are tracked references; `app/` is the working product.</sub>
