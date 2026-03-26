# FitSync — Fitness Made Simple

A full-stack fitness web app built with React + Node.js (Express) + MongoDB.

---

## Project Structure

```
fitsync/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── workout.controller.js
│   │   ├── progress.controller.js
│   │   └── chat.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Workout.model.js
│   │   └── Progress.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── workout.routes.js
│   │   ├── progress.routes.js
│   │   └── chat.routes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── BottomNav.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── onboarding/
    │   │   │   ├── OnboardWeight.js
    │   │   │   ├── OnboardHeight.js
    │   │   │   └── OnboardGoal.js
    │   │   ├── SplashPage.js
    │   │   ├── LandingPage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── TransformPage.js
    │   │   ├── HomePage.js
    │   │   ├── SchedulePage.js
    │   │   ├── StatsPage.js
    │   │   ├── ProfilePage.js
    │   │   └── ChatPage.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## Prerequisites

- Node.js v18+
- MongoDB running locally (`mongod`)
- npm

---

## Setup & Run

### 1. Start MongoDB
Make sure MongoDB is running on your machine:
```bash
mongod
# or on macOS with brew:
brew services start mongodb-community
```

### 2. Backend Setup
```bash
cd fitsync/backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env if needed (default values work for local dev)

# Start backend (dev mode with auto-reload)
npm run dev
```
Backend runs at: **http://localhost:5000**

### 3. Frontend Setup
Open a new terminal:
```bash
cd fitsync/frontend

# Install dependencies
npm install

# Start React app
npm start
```
Frontend runs at: **http://localhost:3000**

---

## App Flow

```
Splash → Landing → Register/Login
  └── Onboarding: Weight → Height → Goal
        └── Transformation Plan Reveal
              └── Home Dashboard
                    ├── Schedule (weekly workout plan)
                    ├── Stats (progress charts)
                    ├── Profile (edit, logout)
                    └── Pulse AI Chat (floating button)
```

---

## API Endpoints

### Auth
| Method | Endpoint           | Description        | Auth |
|--------|--------------------|--------------------|------|
| POST   | /api/auth/register | Register new user  | ✗    |
| POST   | /api/auth/login    | Login              | ✗    |
| GET    | /api/auth/me       | Get current user   | ✓    |

### User / Onboarding
| Method | Endpoint                    | Description         | Auth |
|--------|-----------------------------|---------------------|------|
| GET    | /api/user/profile           | Get profile         | ✓    |
| PUT    | /api/user/profile           | Update profile      | ✓    |
| PUT    | /api/user/onboarding/weight | Save weight step    | ✓    |
| PUT    | /api/user/onboarding/height | Save height step    | ✓    |
| PUT    | /api/user/onboarding/goal   | Save goal + gen plan| ✓    |

### Workouts
| Method | Endpoint                          | Description           | Auth |
|--------|-----------------------------------|-----------------------|------|
| GET    | /api/workouts/schedule            | Weekly plan           | ✓    |
| GET    | /api/workouts/today               | Today's workout       | ✓    |
| GET    | /api/workouts/logs                | Past workout logs     | ✓    |
| POST   | /api/workouts/complete/:planId    | Mark workout done     | ✓    |

### Progress
| Method | Endpoint             | Description        | Auth |
|--------|----------------------|--------------------|------|
| GET    | /api/progress/stats  | Stats + chart data | ✓    |

### Chat
| Method | Endpoint            | Description         | Auth |
|--------|---------------------|---------------------|------|
| POST   | /api/chat/message   | Send message to bot | ✓    |

---

## Features

- **JWT Authentication** — stateless, no 3rd party, token stored in localStorage
- **Validation** — express-validator on backend + client-side form validation
- **Onboarding** — 3-step flow (weight → height → goal), persisted to MongoDB
- **Smart Plan Generation** — calories, protein, and target weight auto-calculated from stats + goal
- **Workout Schedule** — auto-generated 3-day/week plan based on selected goal
- **Streak Tracking** — daily streak counter, weekly workout count
- **Stats Dashboard** — recharts bar chart, total calories, workouts, goals
- **Pulse AI Chat** — rule-based fitness chatbot (no 3rd party API needed)
- **Profile Edit** — update username and age inline
- **Minimalist Design** — dark theme, DM Sans font, lime accent (#c8f135)

---

## Environment Variables (backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitsync
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

---

## Tech Stack

| Layer     | Tech                            |
|-----------|---------------------------------|
| Frontend  | React 18, React Router v6       |
| Styling   | Pure CSS (no UI lib)            |
| Charts    | Recharts                        |
| HTTP      | Axios                           |
| Backend   | Node.js, Express                |
| Database  | MongoDB, Mongoose               |
| Auth      | JWT + bcryptjs                  |
| Validation| express-validator               |
