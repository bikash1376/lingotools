# LingoTools (lingo-extension) 
#### Demo: https://www.youtube.com/watch?v=88Hci4w4eEk

Small Chrome extension + Node backend to translate full pages using lingo.dev.


## Overview
LingoTools captures the current page HTML from the browser popup, sends it to a local server that calls the lingo.dev SDK, and injects the translated HTML back into the page. Lightweight popup UI for quick checks and translation.

## Current features
- Popup UI to check backend health. (triggers '/health') https://lingotools.onrender.com/health
- Capture full page HTML from active tab.
- Send HTML to local backend `/translate`.
- Translate HTML using lingo.dev SDK and apply translated HTML to active tab.
- Basic error and status messages in popup.

## Quick start (local)
1. Server
   - cd server
   - Create `.env` with: `LINGODOTDEV_API_KEY=your_api_key`
   - npm install
   - node index.js
   - Server runs on port 3000 by default.

2. Extension
   - Open chrome://extensions
   - Enable Developer mode
   - Load unpacked and select `extension folder`
   - Open a page, open extension popup, choose locale, click "Translate current page" (Takes some time)

Note: adjust API base URL in popup.js when not using localhost.

## Planned / to-be-implemented features
- PDF translate
  - Upload PDF in popup or context menu
  - Extract text, call lingo.dev, re-render translated PDF or provide download
- Changelog generation
  - Generate changelog from commits (conventional commits)
  - Store changelog per release
- README variants and auto-update
  - Generate README variants (short, long, translated) on CI push
  - Auto-commit updated README files to repository (branch + PR or direct)
- CI / CD
  - GitHub Actions to run tests, lint, and build extension on push
  - Action to push README variants and changelog on tagged release
  - Optional: publish packaged extension artifact
- UI improvements
  - Partial / element-level translations
  - Preview mode before applying translation
  - Option to open translated result in new tab
- Performance & safety
  - Chunking large pages to avoid timeouts
  - Respect site CSP and sensitive pages (login pages)

## CI ideas (short)
- On push to main:
  - run linters, tests
  - build extension zip
  - generate README variants and changelog
  - commit/update files or create PR
- On release/tag:
  - publish artifacts (zip)
  - optionally, publish extension to store (manual step recommended)

## Contributing
- Use env var for API keys; never commit secrets.
