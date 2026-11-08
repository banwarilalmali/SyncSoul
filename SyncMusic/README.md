# SyncMusic – Updated local MVP

A romantic dark pink/purple shared-listening web app built with React, Vite, Express, MongoDB and Socket.IO.

## Included in this update
- Responsive landing, signup, login and dashboard.
- Direct `/dashboard` route for an existing signed-in browser session.
- Create room and join room by six-character code.
- Room Music and Chat tabs.
- Audius search through the backend API; provider response is normalized to a playable track shape.
- Play Now and Add to Queue actions, shared queue, remove-from-queue.
- HTML5 audio player kept mounted while switching Music/Chat tabs.
- Socket.IO room presence, ephemeral live chat and shared playback state.
- In-memory chat (never stored in MongoDB); chat disappears when the room session ends/server restarts.
- Queue snapshots persisted in MongoDB and loaded again when a room is rejoined.
- Session cookie remains httpOnly; `/api/auth/me` supports session restoration.
- Reconnect handling and timestamped playback snapshots for basic drift correction.

## Requirements
- Node.js 20+
- MongoDB Community Server running locally, or a MongoDB Atlas URI.

## Setup
1. Extract and open the `SyncMusic` folder in VS Code.
2. Copy `server/.env.example` to `server/.env`.
3. Set a long random `JWT_SECRET`. Keep `.env` private; never upload it to GitHub.
4. Confirm MongoDB is running. The default URI is `mongodb://127.0.0.1:27017/syncmusic`.
5. Backend terminal:
   ```bash
   cd server
   npm install
   npm run dev
   ```
6. Frontend terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```
7. Open `http://localhost:5173`. After login, dashboard is at `http://localhost:5173/dashboard`.

## Audius
Search uses the official Audius REST API server-side. Most read-only endpoints work without credentials; an API key can be configured for higher rate limits. Audius catalog coverage is not the same as Spotify/YouTube and does not guarantee any specific mainstream track. See https://docs.audius.co/api/.

## Honest feature limits
- This is a local MVP, not a production-hardened commercial release.
- Browser autoplay rules mean each room member may need to press **Enable audio** once before remote playback can start.
- Playback sync is timestamp-based best-effort correction, not sample-accurate synchronization; network latency and provider stream startup vary by device.
- Queue persistence works when MongoDB is available. Active room presence and chat are in memory and are cleared on server restart.
- YouTube remains a separate future integration and must use the official visible IFrame player; no audio extraction or hidden player.
- Email delivery/password reset, avatar uploads, advanced host controls, Auto DJ, shuffle/repeat, formal automated test suite and production deployment hardening are not yet complete.
- Check provider terms and track availability before public deployment.
