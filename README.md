# Device Control Center

Small React + TypeScript + Vite app for selecting devices, scheduling commands, and tracking command status updates via polling.

## Setup

```bash
yarn install
yarn dev
```

Open the local URL printed by Vite.

## Scripts

- `yarn dev` - start dev server
- `yarn build` - production build
- `yarn preview` - preview production build

## Docker

Build and run with Docker Compose:

```bash
docker compose up -d
```

Then open `http://localhost:5173`.

## Features

- Device selection from a mocked API.
- Commands list with loading/empty/error states and status filter.
- Command scheduling with JSON params validation.
- Polling every 5s; no overlapping requests.
- Refresh toggle to re-run `loadCommands` after scheduling.

## Mock API

The mock API is implemented in-memory and wired into Axios:

- `src/api/mockServer.ts` handles `GET /devices` and `GET/POST /devices/:deviceId/commands`.
- `src/api/httpClient.ts` configures a custom Axios adapter.
- `src/api/deviceApi.ts` exposes typed API calls.

Behavior:
- Latency: 800ms per request.
- Failures: random failure rate (toggle in `mockServer.ts`).
- Status progression: `PENDING` -> `LEASED` -> `COMPLETED`/`FAILED` based on age.
- Sorting: newest-first from the API.

## Project Structure

- `src/App.tsx` - page layout.
- `src/components/` - UI sections (selector, commands list, schedule form).
- `src/context/DeviceDataContext.tsx` - shared app state (devices, commands cache, refresh toggle).
- `src/configs/` - types and constants.
- `src/api/` - API client + mock server.

## Implementation Notes

### Time spent
- ~2.5-3 hours total (UI, mock API, data context, polling, fixes).

### Assumptions / tradeoffs
- In-memory mock data with latency/errors to simulate a backend.
- Newest-first ordering from the API to keep UI sorting consistent.
- Params entered as raw JSON in the form to keep UI simple.

### Testing
- Manual testing in the browser:
  - Device selection updates command list.
  - Scheduling with valid/invalid JSON.
  - Polling refreshes command status.
  - Error handling by forcing mock failures.

### What I would improve with more time
- Optimistic UI updates with rollback on error.
- Unit/e2e tests for polling and scheduling flows.
- Routing for device/command detail views.

### AI assistance
- Used AI for polling strategy (Avoid overlapping requests), and mock API structure and beautify the final readme markdown file.
- Accepted: Polling strategy.
- Edited/rejected: Edited the mock API structure and readme file.
