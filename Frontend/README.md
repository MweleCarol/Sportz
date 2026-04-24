# Sportz Frontend

React + Vite frontend for the Sportz live-scores backend.

## Setup

```bash
npm install
npm run dev        # starts on http://localhost:3000
```

The Vite dev server proxies `/matches` and `/ws` to `http://localhost:8000`,
so start the backend first:

```bash
# in the Backend folder
npm run dev   # (or however your backend starts — port 8000)
```

## Folder structure

```
src/
  components/
    MatchCard.jsx        – score card with live minute counter
    MatchDetail.jsx      – right panel: hero score + commentary feed
    CommentaryItem.jsx   – single commentary event row
    UserCommentBox.jsx   – textarea for posting live commentary
    WSStatus.jsx         – WS connection indicator pill
  hooks/
    useWebSocket.js      – connects to /ws, auto-reconnects, subscribe/unsubscribe
  lib/
    api.js               – fetch wrappers for REST endpoints
    helpers.js           – sport icons, event colours, time formatters
  styles/
    globals.css          – CSS variables, animations, resets
  App.jsx                – shell: header, filter tabs, card list, detail panel
  main.jsx               – React root
```

## API integration

| UI action                | Endpoint                              |
|--------------------------|---------------------------------------|
| Load match list          | `GET  /matches?limit=50`             |
| Select match (subscribe) | WS `{ type: "subscribe", matchId }`  |
| View commentary          | `GET  /matches/:id/commentary`       |
| Post fan commentary      | `POST /matches/:id/commentary`       |
| Receive live events      | WS messages `commentary`, `match_created` |

## Commentary post payload

```json
{
  "message": "Great save by the keeper!",
  "minute": 67,
  "eventType": "goal",   // optional – picks up pill selection
  "actor": "Saka"        // optional
}
```
