# Lumina Blog

A modern blog demo with a clean UI, local storage persistence, and optional AI-assisted drafting using Gemini. Built with Vite, TypeScript, Tailwind (via CDN), and includes both a Vanilla DOM implementation and React components.

## Features
- Home feed with featured and recent posts
- Post detail with sharing and comments
- Create post form with cover image preview
- AI “Magic Draft” to generate title, excerpt, and content
- Local storage data persistence by default
- Optional Express API stub for posts and comments

## Tech Stack
- Vite + TypeScript
- TailwindCSS via CDN import
- Lucide icons via CDN
- Optional React components (`pages/`), Vanilla DOM app (`index.tsx`)
- Gemini API via `@google/genai`

## Prerequisites
- Node.js 18+ (LTS recommended)
- Internet access for CDN-loaded libraries (`unpkg.com`, `aistudiocdn.com`)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   - Edit `.env.local` and set your Gemini key:
     ```
     GEMINI_API_KEY=YOUR_API_KEY
     ```
   - Vite injects this value as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` (see `vite.config.ts`).
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open the app:
   - `http://localhost:3000/`

## Build & Preview
- Create a production build:
  ```bash
  npm run build
  ```
- Preview the built app:
  ```bash
  npm run preview
  ```

## AI Draft (Gemini)
- The Create Post page offers a “Magic Draft” banner. Enter a topic and the app will call Gemini to generate structured JSON with `title`, `excerpt`, and Markdown `content`.
- Requires a valid `GEMINI_API_KEY` in `.env.local`. Restart the dev server after changing env values.
- Implementation: `services/aiService.ts` uses `@google/genai` with model `gemini-2.5-flash` and `responseMimeType: application/json`.

## Data Persistence
- Default storage uses `localStorage` with key `lumina_blog_posts` (`services/dataService.ts`).
- Sample posts seed on first run; new posts and comments are stored locally.

## Optional Express API
- A simple Express server is available in `server.js` with endpoints:
  - `GET /api/posts`
  - `GET /api/posts/:id`
  - `POST /api/posts`
  - `POST /api/posts/:id/comments`
- Run it on a different port than Vite (e.g., 3001):
  ```bash
  # PowerShell
  $env:PORT=3001; node server.js
  ```
  ```bash
  # CMD
  set PORT=3001 && node server.js
  ```
- The current UI uses `localStorage`. Switch to fetch calls in `index.tsx` or React pages if you want to use the API.

## Project Structure
```
components/        # Reusable React UI components
pages/             # React pages (Home, CreatePost, PostDetail)
services/          # AI and data services
App.tsx            # React root (not wired by default)
index.html         # HTML entry; loads CDN libs and /index.tsx
index.tsx          # Vanilla DOM app (default entry)
server.js          # Optional Express API
vite.config.ts     # Vite config and env injection
types.ts           # Shared TypeScript types
```

## Troubleshooting
- Missing `react-dom` warning:
  - Vite may warn about `react-dom` during optimization. Install it to silence the warning if you plan to use React components:
    ```bash
    npm i react-dom
    ```
- AI errors on generate:
  - Ensure `GEMINI_API_KEY` is set and valid; restart `npm run dev`.
- CDN availability:
  - The app relies on CDN import maps in `index.html`. Verify network access to `unpkg.com` and `aistudiocdn.com`.

## Notes
- The default UI is the Vanilla DOM app loaded by `index.html` → `/index.tsx`.
- React components exist and can be wired up to a React root if preferred.
