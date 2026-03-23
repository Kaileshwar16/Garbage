# FitSync — React Fitness App

A fully functional fitness tracking web app built with React + Vite.

## Project Structure

```
src/
├── App.jsx                    # Root router
├── index.jsx                  # Entry point
├── theme.js                   # Colors, shared styles
│
├── context/
│   └── UserContext.jsx        # Global user state (React Context)
│
├── utils/
│   ├── constants.js           # Workout data, goal lists, day names
│   └── fitness.js             # BMR, calorie, protein, water calculations
│
├── components/
│   ├── Navbar.jsx             # Top navigation bar
│   ├── StatCard.jsx           # Small stat display card
│   ├── ProgressBar.jsx        # Reusable progress bar
│   ├── CircularTimer.jsx      # SVG countdown/timer ring
│   ├── WorkoutCard.jsx        # Today's workout card on Dashboard
│   └── ExerciseItem.jsx       # Tappable exercise row in WorkoutSession
│
└── pages/
    ├── Splash.jsx             # Animated loading screen
    ├── Welcome.jsx            # Login / Register / Guest landing
    ├── Login.jsx              # Login form
    ├── Register.jsx           # Registration form → Onboarding
    ├── Onboarding.jsx         # 4-step questionnaire (age, body stats, goal, activity)
    ├── PlanReveal.jsx         # Personalised plan summary after onboarding
    ├── Dashboard.jsx          # Main home screen with live stats
    ├── WorkoutSession.jsx     # Live workout timer + exercise checklist
    ├── Schedule.jsx           # Weekly schedule with add/delete sessions
    ├── Stats.jsx              # Stats page with SVG line chart
    ├── Profile.jsx            # Profile with inline edit
    └── PulseAI.jsx            # AI chat overlay (context-aware responses)
```

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Key Features

- **Onboarding questionnaire** — collects age, gender, weight, height, goal, activity level
- **Auto-calculated targets** — calories (Mifflin-St Jeor BMR), protein, water, target weight
- **Live workout timer** — real elapsed time, calorie burn estimate, exercise checklist
- **Workout history** — sessions saved to state, chart updates dynamically
- **Schedule builder** — add/delete/complete sessions per day
- **Context-aware AI** — Pulse AI responses reference the user's actual data
- **Profile edit** — recalculates nutrition targets when body stats change
