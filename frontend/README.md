# ZomFeed — Frontend (React + Vite)

Brief frontend for the ZomFeed project. This is a single-page React application built with Vite that provides the user-facing UI for browsing food reels, authenticating users and food partners, saving and liking items, and creating food posts (partner only).

**This repository is a private project — not open source.**

**Tech stack:** React, Vite, Tailwind (optional), Axios, React Router

**Quick links:**

- Backend server: `../backend` (runs on `http://localhost:3000` by default)

**Table of contents**

- Project overview
- Requirements
- Folder structure (high level)
- Environment variables
- Install & run
- Available scripts
- Pages & components
- Tips & troubleshooting

Project overview

- The frontend consumes a cookie-based authentication backend and presents features for users and food partners. The app expects the backend API to run at `http://localhost:3000` by default.

Requirements

- Node.js (v16+ recommended)
- npm or yarn

Folder structure (important files)

- `src/` — main source code
  - `src/main.jsx` — app bootstrap
  - `src/App.jsx` — root component
  - `src/routes/AppRoutes.jsx` — route definitions
  - `src/pages/` — page views (auth, food-partner, general)
  - `src/components/Reel.jsx` — reel component (video feed)
- `public/` — static assets
- `vite.config.js` — Vite configuration

Environment variables

Create a `.env` file in `frontend/` if you need to override defaults. Vite requires `VITE_` prefix for variables exposed to the client. Example:

```
VITE_API_URL=http://localhost:3000
```

Copy the example file and fill values before running the app:

```bash
# from `frontend/`
cp .env.example .env
```

Do not commit real secrets to source control. Keep `.env` out of version control.

Notes:

- The frontend uses cookie-based authentication. When making API calls with Axios, include credentials:

```javascript
// example axios setup
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export default api;
```

Install & run

Install dependencies:

```bash
# from frontend/
npm install
```

Start development server:

```bash
npm run dev
```

Open: `http://localhost:5173` (Vite default)

Build for production:

```bash
npm run build
npm run preview
```

Available scripts (from `package.json`)

- `npm run dev` — start Vite dev server
- `npm run build` — produce production build
- `npm run preview` — locally preview the production build
- `npm run lint` — run ESLint

Pages & components (high-level)

- `src/pages/auth/` — `UserLogin.jsx`, `UserRegister.jsx`, `PartnerLogin.jsx`, `PartnerRegister.jsx`, `RegisterChoice.jsx`
- `src/pages/food-partner/` — `CreateFood.jsx`, `PartnerProfile.jsx`
- `src/pages/general/` — `Home.jsx`, `Saved.jsx`
- `src/components/Reel.jsx` — main feed item (video + metadata + actions)

Integration notes (backend expectations)

- Backend API base: `http://localhost:3000`
- CORS: backend `src/app.js` allows origin `http://localhost:5173` and sends/accepts cookies. Ensure `withCredentials: true` is set for API calls.
- Authentication: server uses a `token` cookie (JWT) for protected routes.

Common issues & troubleshooting

- CORS / cookies not sent: Make sure frontend uses `withCredentials: true` and backend CORS `credentials: true` is enabled.
- API unreachable: verify backend is running on port `3000` (`server.js` uses port 3000 by default).
- Environment variables: ensure `VITE_API_URL` matches backend URL.

Where to look in the code

- Routes: `src/routes/AppRoutes.jsx`
- API calls: look for `axios` instances or direct `fetch` usage
- Styling: `src/styles/` contains `shared.css`, `reels.css`, `partner-profile.css`, and `variables.css`
