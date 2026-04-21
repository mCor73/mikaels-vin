# Changelog

All notable changes to Mikael's Vin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-04-21

### Added
- Five new wine travel itineraries: Burgundy (3 days, Côte d'Or), Piedmont (3 days, Barolo & Barbaresco), Champagne (2 days, Reims & Épernay), Mosel (3 days, Bernkastel & Saar), Douro Valley (3 days, Porto to Pinhão)

## [1.0.0] — 2026-04-21

First versioned release. Everything below has shipped across iterative sessions.

### Tasting notes
- Add, edit, delete tasting notes with appearance, nose, palate, and summary
- Structure measures: acid, tannin, body on a −− to ++ scale, displayed as 5-dot pip scale
- Wine colour (red / white / rosé / orange / sparkling / fortified / dessert) drives card accent colour
- Style (dry through luscious), vintage, tasted-on date
- 5-star rating and Parker-style numeric score (50–100)
- Event field — groups wines into tastings
- Provenance fields: producer, region, grape variety (with autocomplete from your history)
- Star marking for favourites
- Search across all fields including notes
- Copy-from-previous when creating a new note
- Add-another-from-event button on every note
- Rank wines within an event with −− to ++ pips

### Home
- Editorial "Mikael's Vin" branding, sommelier-notebook aesthetic
- Stats panel (bottle count, starred, avg rating, this year, colour distribution)
- Section buttons: Tastings, Quiz, Travel, Encyclopedia, Share via QR

### Cellar
- Track physical bottles and their storage location
- Add / remove / relocate bottles
- Integrated with import/export

### Quiz
- Create and edit quizzes with multiple-choice questions
- Live multi-player quiz with shared realtime leaderboard (Supabase-powered)
- Quizmaster controls pacing (start, next question, end)
- 5-character join code for participants
- Per-question breakdown statistics on the results page (option votes, difficulty)
- Leaderboard with placement, personal score summary
- Delete drafts and past quizzes

### Travel
- Day-by-day curated wine trip itineraries
- First itinerary: Rioja, 3 days

### Encyclopedia
- Reference for ~38 common grape varieties and classic blends
- Character descriptions and growing regions
- Search and filter by Red / White / Blends

### Data
- Full XML import and export including tasting notes, cellar, and quizzes
- Optional Dropbox sync for tasting notes and cellar
- Three-tier storage fallback: Claude artifact storage → localStorage → in-memory

### Sharing
- Client-side QR code generation (no external service)
- URL auto-detect with manual override option
- Native share sheet on supported browsers

### Polish
- Home button on every non-home view
- Back buttons respect navigation context
- Toasts for feedback
- Confirmation dialogs for destructive actions
- Safe-area insets for iPhone notch / Dynamic Island
- Works offline once loaded (local-first)

---

## Release process

When releasing a new version:

1. Bump `APP_VERSION` and update `APP_BUILD_DATE` in `index.html`
2. Add an entry at the top of this file under a new version heading
3. Commit with message `release: vX.Y.Z`
4. Tag: `git tag vX.Y.Z && git push origin main --tags`
5. Create a GitHub Release from the tag

## Template for future entries

```
## [X.Y.Z] — YYYY-MM-DD

### Added
- New features

### Changed
- Behaviour changes to existing features

### Fixed
- Bug fixes

### Removed
- Features that were taken out

### Security
- Security-related changes
```
