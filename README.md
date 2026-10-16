# NEXAI

![Cinematic hero](https://capsule-render.vercel.app/api?type=rect&color=0:070707,100:191919&height=230&text=NEXAI&fontColor=F3F3EE&fontSize=52&fontAlignY=38&desc=AI%20%2F%20PRODUCT%20EXPERIMENT&descColor=999991&descSize=12&descAlignY=66&animation=twinkling)

> **A product workspace exploring the gap between AI intent and an actionable interface.**

NexAI is an experimental maternal-health product surface built around an explicit boundary between the browser experience and server-side integrations. It is a prototype, not a validated clinical system.

## Repository layout

- `nexai-web/` — React/Vite frontend and PWA assets
- `nexai-web/server/` — Express API, authentication, local SQLite persistence and server-only AI integration
- `nexai-web/server/test/` — API authentication middleware tests

## Run locally

**Requirements:** Node.js 22.5+ and npm. The API uses Node's built-in `node:sqlite` module.

**Terminal 1 — API server**

```bash
cd nexai-web/server
npm ci
cp .env.example .env
```

Generate a random secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set the generated value as `JWT_SECRET` inside `nexai-web/server/.env`. Add a real `DEEPSEEK_API_KEY` only if you intend to use the server-side triage integration. To provision clinician accounts, put verified clinician email addresses in `CLINICIAN_EMAILS`, separated by commas. Never allow a client to choose its own role.

Then start the API:

```bash
npm start
```

The API defaults to `http://localhost:3001`.

**Terminal 2 — web client**

```bash
cd nexai-web
npm ci
npm run dev
```

The client reads `VITE_API_BASE_URL` from its local environment template. Browser-visible `VITE_*` variables must contain public configuration only — never private API keys or service credentials.

## Checks

From `nexai-web/`:

```bash
npm run build
npm run lint
npm run test:e2e
```

From `nexai-web/server/`:

```bash
npm test
```

The CI workflow runs the frontend build/lint checks, JavaScript syntax checks, and server authentication unit tests.

## Security and data notes

- The server refuses to start in production when `JWT_SECRET` is missing, a placeholder, or too short.
- The clinician API requires a server-provisioned `clinician` role; do not use a client-controlled role field.
- SQLite databases and transient WAL/SHM files are created locally at runtime and must not be committed. Earlier revisions included database artifacts; those have been removed from the current source tree.
- Triage output is experimental decision support and must not be treated as a diagnosis or emergency-response replacement. If the AI service is unconfigured, the API returns an explicit unavailable status rather than pretending that analysis ran.
- This prototype has not been validated for real clinical use.

---
Maintained by [K. Kishor Kumar](https://github.com/Kishordiu).
