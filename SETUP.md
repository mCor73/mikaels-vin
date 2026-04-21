# First-time setup guide

This walks you through getting the repo onto GitHub and the app hosted on GitHub Pages for the first time. After this, every code change just needs a `git push` and the site redeploys automatically.

## 1. Create the GitHub repo (2 minutes)

1. Go to **https://github.com/new**
2. Repository name: `mikaels-vin` (or whatever you like — just remember it)
3. Description: *"Personal wine tasting journal with quiz and cellar"*
4. Set it to **Public** (required for free GitHub Pages) or **Private** (requires a paid plan for Pages, or use the public one for now)
5. **Do NOT** check "Add a README" / "Add .gitignore" / "Add a license" — this repo already has those files and we want to avoid merge conflicts
6. Click **Create repository**

GitHub will show you a page with setup instructions. Leave that tab open — you'll use the URL from there.

## 2. Upload the files (pick one path)

### Option A — Drag & drop in the browser (easiest, no command line)

1. On the freshly-created empty repo page, click **"uploading an existing file"** in the blue info box
2. Drag *all files and folders from the `mikaels-vin-repo` folder* onto the upload area. Important — upload the contents of the folder, not the folder itself. You want `index.html`, `README.md`, etc. at the root of the repo, plus the `.github` folder preserved as-is
3. Scroll down, write a commit message like *"Initial commit — v1.0.0"*
4. Click **Commit changes**

If the drag-and-drop misses the `.github` folder (some browsers hide dotfiles), do it separately: back on the main repo page, click **Add file → Upload files**, drop just the `.github` folder, commit again.

### Option B — Command line (faster for future updates)

From a terminal, in the `mikaels-vin-repo` folder:

```bash
git init
git add .
git commit -m "Initial commit — v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mikaels-vin.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. The first `git push` may prompt you to authenticate — use a personal access token if prompted for a password (GitHub no longer accepts account passwords for Git operations). Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token, with `repo` scope.

## 3. Enable GitHub Pages

1. On the repo page, click **Settings** (top nav)
2. In the left sidebar, click **Pages**
3. Under "Build and deployment" → "Source", select **GitHub Actions**

That's it. The workflow (`.github/workflows/deploy.yml`) will now run automatically on every push to `main`.

## 4. Tag the v1.0.0 release

After the repo is uploaded, create the first release tag so there's a permanent snapshot of this version.

### In the browser

1. On the repo page, click **Releases** (right sidebar, or the tab near the top)
2. Click **Create a new release** (or **Draft a new release**)
3. Click **Choose a tag** → type `v1.0.0` → click **Create new tag: v1.0.0 on publish**
4. Release title: `v1.0.0`
5. Description: copy the v1.0.0 section from `CHANGELOG.md`
6. Click **Publish release**

### Or with the command line

```bash
git tag -a v1.0.0 -m "v1.0.0 — first versioned release"
git push origin v1.0.0
```

Then create the release from the tag in the GitHub UI as above.

## 5. First deploy — wait and verify

1. Go to the **Actions** tab on the repo
2. You should see a running (or completed) workflow called **"Deploy to GitHub Pages"**
3. Once it finishes (~1–2 minutes), go to **Settings → Pages** — a URL appears at the top, like `https://YOUR-USERNAME.github.io/mikaels-vin/`
4. Open that URL in your browser. You should see the app

## 6. Update the QR code URL inside the app

Now that you have a permanent URL, tell the app's QR code to always point there (rather than auto-detecting):

1. Open the app from your phone
2. Tap **Share via QR**
3. At the bottom, under **Override URL**, paste your GitHub Pages URL (e.g. `https://YOUR-USERNAME.github.io/mikaels-vin/`)
4. Tap **Save**

From now on, anyone scanning the QR lands on your live deployed version.

## 7. Update the README

Open `README.md` in the GitHub UI, click the pencil icon, and find the placeholder `YOUR-USERNAME` on line 5 — replace with your actual GitHub username. Commit the change directly to `main`. (This triggers another deploy, which is harmless.)

---

## Ongoing workflow

From now on, when you want to make changes:

```bash
# Make your edits to index.html
git add index.html
git commit -m "feat: add [whatever you added]"
git push
```

Within 1–2 minutes, the change is live at your Pages URL.

For a new release with an updated version number:

```bash
# Bump APP_VERSION and APP_BUILD_DATE in index.html
# Add a section to CHANGELOG.md
git add index.html CHANGELOG.md
git commit -m "release: v1.1.0"
git tag v1.1.0
git push origin main --tags
```

Then create a GitHub Release from the tag in the browser, pasting the new changelog section.

## Rolling back a release

If something breaks after a release, you can revert to any earlier version:

1. **Actions tab** → find the workflow run from a previous commit you trust
2. Click **...** → **Re-run all jobs** on that earlier commit

Or more permanently, in the command line:

```bash
git revert <bad-commit-sha>
git push
```

Or point Pages at a specific tag manually if needed.

---

## Troubleshooting

**The Actions workflow fails with "Pages not enabled"**
→ Go to Settings → Pages, set Source to **GitHub Actions**, then re-run the workflow from the Actions tab.

**The page 404s at the Pages URL**
→ Wait 2 minutes after the workflow completes. First-time Pages deployments sometimes take a few extra minutes to propagate.

**My Supabase credentials are exposed in the HTML**
→ That's intentional and correct — Supabase's anon public key is designed to be published client-side. Real security comes from the Row-Level Security policies you set in the `supabase-schema.sql` file. Never commit your `service_role` key — that one is admin-level and must never be in a frontend.
