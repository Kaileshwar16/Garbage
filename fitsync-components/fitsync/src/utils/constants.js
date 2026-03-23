export const GOALS = [
  "Fat Loss",
  "Muscle Gain",
  "Maintain Weight",
  "Improve Endurance",
  "General Fitness",
];

export const ACTIVITY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const GENDERS = ["Male", "Female", "Other"];

export const GOAL_EMOJI = {
  "Fat Loss":          "🔥",
  "Muscle Gain":       "💪",
  "Maintain Weight":   "⚖️",
  "Improve Endurance": "🏃",
  "General Fitness":   "🌟",
};

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Summary for dashboard workout card */
export const WORKOUT_MAP = {
  "Fat Loss": {
    name: "HIIT Cardio Blast",
    dur: "30 min",
    exercises: ["Jump Squats (4×15)", "Burpees (3×12)", "High Knees (4×30s)", "Mountain Climbers (3×20)"],
  },
  "Muscle Gain": {
    name: "Upper Body Power",
    dur: "45 min",
    exercises: ["Bench Press (4×10)", "Shoulder Press (3×12)", "Weighted Pull-ups (3×8)", "Lateral Raises (3×15)"],
  },
  "Maintain Weight": {
    name: "Full Body Conditioning",
    dur: "40 min",
    exercises: ["Push-ups (3×15)", "Goblet Squats (3×12)", "Plank (3×45s)", "Dumbbell Rows (3×12)"],
  },
  "Improve Endurance": {
    name: "Endurance Run",
    dur: "35 min",
    exercises: ["Warm-up Jog (5min)", "Tempo Run (20min)", "Cool-down (5min)", "Stretching (5min)"],
  },
  "General Fitness": {
    name: "Balanced Workout",
    dur: "40 min",
    exercises: ["Box Steps (3×12)", "Resistance Press (3×12)", "Core Circuit (3 rounds)", "Yoga Cool-down"],
  },
};

/** Detailed exercise list for workout session */
export const WORKOUT_DETAIL_MAP = {
  "Fat Loss": {
    name: "HIIT Cardio Blast",
    exercises: [
      { name: "Jump Squats",       sets: "4 sets × 15 reps" },
      { name: "Burpees",           sets: "3 sets × 12 reps" },
      { name: "High Knees",        sets: "4 sets × 30 sec"  },
      { name: "Mountain Climbers", sets: "3 sets × 20 reps" },
    ],
  },
  "Muscle Gain": {
    name: "Upper Body Power",
    exercises: [
      { name: "Bench Press",       sets: "4 sets × 10 reps" },
      { name: "Shoulder Press",    sets: "3 sets × 12 reps" },
      { name: "Weighted Pull-ups", sets: "3 sets × 8 reps"  },
      { name: "Lateral Raises",    sets: "3 sets × 15 reps" },
    ],
  },
  "Maintain Weight": {
    name: "Full Body Conditioning",
    exercises: [
      { name: "Push-ups",       sets: "3 sets × 15 reps" },
      { name: "Goblet Squats",  sets: "3 sets × 12 reps" },
      { name: "Plank",          sets: "3 sets × 45 sec"  },
      { name: "Dumbbell Rows",  sets: "3 sets × 12 reps" },
    ],
  },
  "Improve Endurance": {
    name: "Endurance Run",
    exercises: [
      { name: "Warm-up Jog",       sets: "5 minutes"  },
      { name: "Tempo Run",         sets: "20 minutes" },
      { name: "Cool-down Walk",    sets: "5 minutes"  },
      { name: "Full-body Stretch", sets: "5 minutes"  },
    ],
  },
  "General Fitness": {
    name: "Balanced Workout",
    exercises: [
      { name: "Box Steps",         sets: "3 sets × 12 reps" },
      { name: "Resistance Press",  sets: "3 sets × 12 reps" },
      { name: "Core Circuit",      sets: "3 rounds"         },
      { name: "Cool-down Yoga",    sets: "5 minutes"        },
    ],
  },
};
