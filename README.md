# Mikael's Vin

> A personal wine tasting journal, cellar manager, and multi-player wine quiz.

**Live app:** https://YOUR-USERNAME.github.io/mikaels-vin/ *(update once Pages is set up)*

Single-file HTML app for logging wine tasting notes, tracking your cellar, running live multi-player wine quizzes, and exploring grape varieties and wine-travel itineraries. Works on phone and desktop, installable to the home screen as a web app.

---

## Features

- **Tasting notes** — appearance, nose, palate, summary, with structure measures (acid, tannin, body) on a −− to ++ scale, plus colour, style, Parker score, 5-star rating, event, and provenance (producer, region, grape) fields
- **Tastings** — wines grouped by event, with individual ranking within each event
- **Cellar** — track physical bottles and their storage locations
- **Wine quiz** — multi-player live quiz with shared leaderboard, powered by Supabase realtime
- **Grape encyclopedia** — reference for common varieties and classic blends, with growing regions
- **Wine travel** — curated day-by-day itineraries for the great wine regions
- **QR sharing** — let friends scan their way into the app
- **Import / export** — XML backup of all your data (tasting notes, cellar, quizzes)
- **Optional Dropbox sync** — keep tasting notes and cellar data in sync across devices
- **Works offline** — all data lives locally; cloud sync is opt-in

## Tech stack

- Plain HTML, CSS, and JavaScript — no build step, no framework
- `localStorage` for local persistence (with a `window.storage` shim for Claude's artifact preview)
- Dropbox API v2 for cross-device tasting-note sync (optional)
- Supabase for live quiz multiplayer (optional; required only for live quizzes)
- `qrcode-generator` for client-side QR generation

## Running locally

Just open `index.html` in a browser. No server, no build. For the cleanest experience on iPhone:

1. Host the file somewhere (see below)
2. Open the URL in Safari
3. Tap Share → Add to Home Screen
4. Launch from the home-screen icon for a full-screen, app-like experience

## Hosting

### GitHub Pages (automatic)

This repo is configured to auto-deploy to GitHub Pages. Every push to `main` publishes the latest `index.html` to `https://YOUR-USERNAME.github.io/mikaels-vin/` within 1–2 minutes.

See `.github/workflows/deploy.yml` for the workflow.

### Netlify Drop (manual)

Drag `index.html` onto https://app.netlify.com/drop — instant URL, no account needed.

## Data storage

### Local (default)

Everything lives in `localStorage` on your device. Safe and fast, but doesn't sync across devices. Use the **Export to XML** feature for backups.

### Dropbox sync (optional)

Settings → Storage → Dropbox. You'll need a Dropbox API token — instructions in the app. Syncs tasting notes and cellar bottles across all devices using the same token.

### Supabase (quiz backend)

The quiz feature uses a hardcoded Supabase project (see the `SUPABASE_URL` and `SUPABASE_ANON_KEY` constants in `index.html`). If you fork this repo and want your own quiz backend, replace those two values and run the SQL in `supabase-schema.sql` against your Supabase project.

## Versioning

Releases follow [semver](https://semver.org):

- **Major** (x.0.0) — breaking changes, e.g. a storage format change that can't auto-migrate
- **Minor** (1.x.0) — new features that don't break existing data
- **Patch** (1.0.x) — bug fixes, polish, copy changes

The current version is shown in the app header and on the Storage settings page. Full version history is in [CHANGELOG.md](./CHANGELOG.md).

When cutting a release, bump `APP_VERSION` and `APP_BUILD_DATE` at the top of the `<script>` block in `index.html`, commit, then tag:

```bash
git add index.html CHANGELOG.md
git commit -m "release: v1.1.0"
git tag v1.1.0
git push origin main --tags
```

Then create a GitHub Release from the tag to get a nicely-formatted release notes page.

## Privacy

This is a personal project. Everything lives on your device by default. The optional cloud integrations (Dropbox, Supabase) talk directly to those services from your browser — nothing passes through any server operated by this project.

## License

MIT — see [LICENSE](./LICENSE).
