# ZomFeed — Backend (Node + Express)

Backend API for the ZomFeed project. This service provides authentication (cookie-based JWT), food item creation and listing, partner profiles, and simple image/video upload integration.

**This repository is a private project — not open source.**

**Tech stack:** Node.js, Express, MongoDB (Mongoose), JWT, ImageKit, Multer

Quick links

- Frontend: `../frontend` (expects API at `http://localhost:3000` by default)

Table of contents

- Project overview
- Requirements
- Folder structure (high level)
- Environment variables
- Install & run
- API endpoints (summary)
- Notes on authentication & cookies
- Troubleshooting

Project overview

- This backend exposes REST endpoints used by the frontend to register/login users and food partners, create and list food items (video upload for partners), and allow users to like/save items. It stores data in MongoDB and uploads media via ImageKit.

Requirements

- Node.js (v16+ recommended)
- npm
- MongoDB accessible from the runtime (local or hosted)

Folder structure (important files)

- `server.js` — app entry point
- `src/app.js` — express app and middleware
- `src/db/db.js` — MongoDB connection
- `src/controllers/` — request handlers (`auth.controller.js`, `food.controller.js`, `food-partner.controller.js`)
- `src/routes/` — route definitions (`auth.routes.js`, `food.routes.js`, `food-partner.routes.js`)
- `src/models/` — Mongoose models (`user.model.js`, `food.model.js`, `foodpartner.model.js`, `likes.model.js`, `save.model.js`)
- `src/middlewares/` — auth middleware
- `src/services/storage.service.js` — ImageKit upload helper

Environment variables

Create a `.env` file in the `backend/` folder with the following keys (examples):

```
MONGODB_URI=mongodb://localhost:27017/zomfeed
JWT_SECRET=your_jwt_secret_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account
```

Copy the example file and fill values before running the app:

```bash
# from `backend/`
cp .env.example .env
```

Do not commit real secrets to source control. Keep `.env` out of version control.

Notes:

- The app uses `process.env.MONGODB_URI` (see `src/db/db.js`) to connect to MongoDB.
- JWT signing/verification uses `process.env.JWT_SECRET` (see `src/controllers/auth.controller.js` and `src/middlewares/auth.middleware.js`).
- Image uploads are performed with ImageKit; keys are read from `process.env.IMAGEKIT_*` in `src/services/storage.service.js`.
- The server currently listens on port `3000` (see `server.js`).

Install & run

Install dependencies:

```bash
# from backend/
npm install
```

Run the server:

```bash
# run directly with node
node server.js

# or run with nodemon (recommended for development)
npx nodemon server.js
```

There is no preconfigured `start` script in `package.json`; you can add one (example below) if desired:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

API endpoints (summary)

Base URL: `http://localhost:3000`

- Authentication (prefix `/api/auth`):

  - `POST /api/auth/user/register` — register a new user
  - `POST /api/auth/user/login` — login user (sets `token` cookie)
  - `GET  /api/auth/user/logout` — logout user (clears cookie)
  - `POST /api/auth/foodpartner/register` — register a food partner
  - `POST /api/auth/foodpartner/login` — login food partner
  - `GET  /api/auth/foodpartner/logout` — logout food partner

- Food (prefix `/api/food`):

  - `POST   /api/food` — (food partners only) create a food item with `video` file upload (multipart/form-data)
  - `GET    /api/food` — (authenticated users) list food items
  - `POST   /api/food/like` — (authenticated users) like a food item
  - `POST   /api/food/save` — (authenticated users) save a food item
  - `GET    /api/food/save` — (authenticated users) get saved items

- Food Partner (prefix `/api/foodpartner`):
  - `GET /api/foodpartner/:id` — get partner profile by id (authenticated users)

Authentication & cookies

- This backend uses cookie-based authentication. On successful login/register the server sets a cookie named `token` containing a JWT. Protect routes rely on `req.cookies.token` and `process.env.JWT_SECRET`.
- The frontend must include credentials for requests that rely on cookies; if using Axios, set `withCredentials: true`.
- CORS: `src/app.js` currently allows `origin: "http://localhost:5173"` and `credentials: true`. Update this if you serve the frontend elsewhere.

Troubleshooting

- DB connection error: confirm `MONGODB_URI` is correct and database is reachable.
- Missing JWT secret: ensure `JWT_SECRET` is set; otherwise token signing/verification will fail.
- Image uploads failing: ensure ImageKit keys and `IMAGEKIT_URL_ENDPOINT` are set in `.env`.
- CORS / cookies not sent: confirm frontend uses `withCredentials: true` and that `src/app.js` CORS origin matches your frontend.

Where to look in the code

- Express app and CORS settings: `src/app.js`
- DB connection: `src/db/db.js`
- Auth handlers: `src/controllers/auth.controller.js`
- Food handlers: `src/controllers/food.controller.js`
- Image upload helper: `src/services/storage.service.js`
