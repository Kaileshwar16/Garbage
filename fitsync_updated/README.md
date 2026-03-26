# FitSync — Full Stack Fitness App

## Features (matching Figma design)

### Frontend
- **Splash** — 3-stage animated intro (matching Figma mobile splash1/2/3)
- **Auth** — Login, Register, Forgot Password flow
- **Onboarding** — Weight, Height, Goal sliders → Transformation summary
- **Home** — Greeting, Calories progress, Streak, Weekly done, Water intake tracker (+/- 250ml), Steps count with progress bar, Next session, Goal setting tile, Pulse AI FAB
- **TopNav** — FitSync logo, Home/Schedule/Stats/Profile links, user avatar (matches Figma web UI)
- **Schedule** — Mon–Sun pill day selector (today highlighted), workout cards with time (08:00AM/02:00PM), exercise list expand, full-week overview list
- **Workout Timer** — Circular countdown timer, play/pause, exercise checklist (tap to complete), Finish/Complete buttons
- **Stats** — Day/Week/Month tabs, Area line chart (Workout Duration), Weekly Avg display, Water + Steps tiles, Metric grid, Goals section
- **Profile** — Avatar with online dot, stats strip (weight/height/age), Edit Profile / Settings / Progress / Logout menu rows
- **Chat (Pulse AI)** — Bot header with online status, "Powered by FitSync Intelligence" badge, quick reply chips, full chat UI

### Backend API
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user |
| PUT  | /api/user/onboarding/weight | Save weight |
| PUT  | /api/user/onboarding/height | Save height |
| PUT  | /api/user/onboarding/goal | Save goal + generate plan |
| GET  | /api/user/profile | Get profile |
| PUT  | /api/user/profile | Update profile |
| GET  | /api/workouts/today | Today's workout |
| GET  | /api/workouts/schedule | Weekly schedule |
| GET  | /api/workouts/plan/:id | Get plan by ID (for timer) |
| POST | /api/workouts/complete/:id | Mark workout complete |
| GET  | /api/workouts/logs | Workout history |
| GET  | /api/progress/stats | Stats + weekly performance |
| GET  | /api/tracking/today | Today's water + steps |
| PUT  | /api/tracking/water | Update water intake (delta) |
| PUT  | /api/tracking/steps | Update step count |
| POST | /api/chat/message | Chat with Pulse AI |

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend proxies API calls to `http://localhost:5000` automatically.

## Tech Stack
- **Frontend**: React 18, React Router 6, Recharts, Axios
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs
