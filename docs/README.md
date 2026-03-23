# Urban Trend Push — Desktop App

A native desktop app to push all your Urban Trend Shopify theme files to GitHub in one click.

---

## Quick Start (2 minutes)

### Requirements
- [Node.js](https://nodejs.org/) v18 or higher (includes npm)

### Steps

```bash
# 1. Install dependencies (one time only)
npm install

# 2. Launch the app
npm start
```

That's it. The app window will open.

---

## How to Use

1. **Connect** — Paste your GitHub Personal Access Token
2. **Repository** — Pick an existing repo or create a new one
3. **Select Folder** — Click the folder button → choose your Downloads folder (or wherever your files are)
4. **Review & Push** — All files are auto-detected and routed. Hit 🚀 Push.

---

## File Routing

Files are automatically placed in the right GitHub folder:

| File type | GitHub folder |
|-----------|--------------|
| `.liquid` | `snippets/` |
| `.css`, `.js` | `assets/` |
| `.md` | `docs/` |
| `.html`, `.zip`, anything else | `tools/` |

---

## Creating a GitHub Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Name: "Urban Trend Push"
4. Expiry: 90 days
5. Scope: check only **repo**
6. Click Generate — copy the token

---

## Build a Standalone Executable (optional)

To build a `.exe` / `.dmg` / `.AppImage` you can share:

```bash
# Install builder
npm install electron-builder --save-dev

# Build for your platform
npm run build:win    # Windows → dist/Urban Trend Push Setup.exe
npm run build:mac    # macOS  → dist/Urban Trend Push.dmg
npm run build:linux  # Linux  → dist/Urban Trend Push.AppImage
```

---

## Security

- Your GitHub token is **never** sent to any server other than `api.github.com`
- It lives in memory only for the session — not saved to disk
- This app has no analytics, no telemetry, no external connections except GitHub's API

---

## Project Structure

```
ut-push-desktop/
├── main.js        ← Electron main process (file system access, dialogs)
├── preload.js     ← Secure bridge between main and renderer
├── src/
│   └── index.html ← Full UI (renderer process)
├── assets/        ← App icons
└── package.json
```
