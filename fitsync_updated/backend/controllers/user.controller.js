const User = require('../models/User.model');
const { WorkoutPlan } = require('../models/Workout.model');

// Helper: calculate fitness plan based on goal + stats
const calculatePlan = (weight, height, goal) => {
  // BMR using Mifflin-St Jeor (assume moderate activity)
  const bmr = 10 * weight + 6.25 * height - 5 * 30 + 5; // simplified (no age stored yet)
  const tdee = Math.round(bmr * 1.55);

  let dailyCalories = tdee;
  let dailyProtein = Math.round(weight * 1.6);
  let targetWeight = weight;

  if (goal === 'Strength Training for Muscle Gain') {
    dailyCalories = tdee + 300;
    dailyProtein = Math.round(weight * 2.0);
    targetWeight = Math.round(weight * 1.05);
  } else if (
    goal === 'High-Intensity Interval Training for Fat Loss' ||
    goal === 'Cardiovascular Exercise for Fat Loss'
  ) {
    dailyCalories = tdee - 400;
    dailyProtein = Math.round(weight * 1.8);
    targetWeight = Math.round(weight * 0.93);
  } else if (goal === 'Functional Training for Overall Fitness') {
    dailyCalories = tdee;
    dailyProtein = Math.round(weight * 1.6);
    targetWeight = weight;
  }

  return { dailyCalories, dailyProtein, targetWeight };
};

// Helper: generate workout schedule based on goal
const generateWorkoutPlan = (userId, goal) => {
  const plans = {
    'Strength Training for Muscle Gain': [
      {
        day: 'Monday',
        title: 'Upper Body',
        duration: 45,
        caloriesBurned: 320,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8 },
          { name: 'Shoulder Press', sets: 3, reps: 10 },
          { name: 'Pull-ups', sets: 3, reps: 8 },
          { name: 'Tricep Dips', sets: 3, reps: 12 },
        ],
      },
      {
        day: 'Wednesday',
        title: 'Lower Body',
        duration: 50,
        caloriesBurned: 380,
        exercises: [
          { name: 'Squats', sets: 4, reps: 8 },
          { name: 'Romanian Deadlift', sets: 3, reps: 10 },
          { name: 'Leg Press', sets: 3, reps: 12 },
          { name: 'Calf Raises', sets: 4, reps: 15 },
        ],
      },
      {
        day: 'Friday',
        title: 'Full Body Strength',
        duration: 55,
        caloriesBurned: 400,
        exercises: [
          { name: 'Deadlift', sets: 4, reps: 6 },
          { name: 'Barbell Row', sets: 3, reps: 8 },
          { name: 'Incline Press', sets: 3, reps: 10 },
          { name: 'Lunges', sets: 3, reps: 12 },
        ],
      },
    ],
    'High-Intensity Interval Training for Fat Loss': [
      {
        day: 'Monday',
        title: 'HIIT Cardio',
        duration: 30,
        caloriesBurned: 420,
        exercises: [
          { name: 'Burpees', sets: 4, reps: 15 },
          { name: 'Jump Squats', sets: 4, reps: 20 },
          { name: 'Mountain Climbers', sets: 4, duration: 1 },
          { name: 'Sprint Intervals', sets: 6, duration: 1 },
        ],
      },
      {
        day: 'Wednesday',
        title: 'Tabata Circuit',
        duration: 25,
        caloriesBurned: 360,
        exercises: [
          { name: 'High Knees', sets: 8, duration: 1 },
          { name: 'Box Jumps', sets: 4, reps: 12 },
          { name: 'Kettlebell Swings', sets: 4, reps: 20 },
          { name: 'Jumping Jacks', sets: 4, duration: 2 },
        ],
      },
      {
        day: 'Friday',
        title: 'HIIT Full Body',
        duration: 35,
        caloriesBurned: 450,
        exercises: [
          { name: 'Jump Rope', sets: 5, duration: 2 },
          { name: 'Push-ups', sets: 4, reps: 20 },
          { name: 'Plank Hold', sets: 4, duration: 1 },
          { name: 'Battle Ropes', sets: 4, duration: 1 },
        ],
      },
    ],
    'Cardiovascular Exercise for Fat Loss': [
      {
        day: 'Monday',
        title: 'Steady State Cardio',
        duration: 45,
        caloriesBurned: 350,
        exercises: [
          { name: 'Treadmill Run', duration: 30 },
          { name: 'Cycling', duration: 15 },
        ],
      },
      {
        day: 'Tuesday',
        title: 'Cardio Intervals',
        duration: 40,
        caloriesBurned: 380,
        exercises: [
          { name: 'Elliptical Intervals', sets: 8, duration: 3 },
          { name: 'Walking Lunges', sets: 3, reps: 20 },
          { name: 'Jump Rope', sets: 3, duration: 3 },
        ],
      },
      {
        day: 'Thursday',
        title: 'Endurance Training',
        duration: 50,
        caloriesBurned: 400,
        exercises: [
          { name: 'Long Run', duration: 35 },
          { name: 'Cool Down Walk', duration: 15 },
        ],
      },
    ],
    'Functional Training for Overall Fitness': [
      {
        day: 'Monday',
        title: 'Functional Strength',
        duration: 45,
        caloriesBurned: 340,
        exercises: [
          { name: 'Goblet Squats', sets: 3, reps: 12 },
          { name: 'TRX Rows', sets: 3, reps: 12 },
          { name: 'Turkish Get-ups', sets: 3, reps: 5 },
          { name: 'Farmer Carries', sets: 4, duration: 1 },
        ],
      },
      {
        day: 'Wednesday',
        title: 'Mobility & Core',
        duration: 40,
        caloriesBurned: 280,
        exercises: [
          { name: 'Plank Variations', sets: 4, duration: 1 },
          { name: 'Dead Bug', sets: 3, reps: 12 },
          { name: 'Hip Hinges', sets: 3, reps: 15 },
          { name: 'Yoga Flow', duration: 15 },
        ],
      },
      {
        day: 'Friday',
        title: 'Athletic Performance',
        duration: 50,
        caloriesBurned: 400,
        exercises: [
          { name: 'Agility Ladder', sets: 5, duration: 2 },
          { name: 'Medicine Ball Slams', sets: 4, reps: 12 },
          { name: 'Box Jumps', sets: 4, reps: 8 },
          { name: 'Band Resistance Work', sets: 3, reps: 15 },
        ],
      },
    ],
  };

  const selectedPlans = plans[goal] || plans['Functional Training for Overall Fitness'];
  return selectedPlans.map((plan) => ({ ...plan, userId }));
};

// PUT /api/user/onboarding/weight
const saveWeight = async (req, res) => {
  const { weight, weightUnit } = req.body;
  if (!weight || weight < 20 || weight > 500) {
    return res.status(400).json({ message: 'Invalid weight value' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { weight, weightUnit: weightUnit || 'kg' },
      { new: true }
    );
    res.json({ weight: user.weight, weightUnit: user.weightUnit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/user/onboarding/height
const saveHeight = async (req, res) => {
  const { height, heightUnit } = req.body;
  if (!height || height < 50 || height > 300) {
    return res.status(400).json({ message: 'Invalid height value' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { height, heightUnit: heightUnit || 'cm' },
      { new: true }
    );
    res.json({ height: user.height, heightUnit: user.heightUnit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/user/onboarding/goal
const saveGoal = async (req, res) => {
  const { goal } = req.body;
  const validGoals = [
    'Strength Training for Muscle Gain',
    'High-Intensity Interval Training for Fat Loss',
    'Cardiovascular Exercise for Fat Loss',
    'Functional Training for Overall Fitness',
  ];
  if (!validGoals.includes(goal)) {
    return res.status(400).json({ message: 'Invalid goal selection' });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user.weight || !user.height) {
      return res.status(400).json({ message: 'Complete weight and height steps first' });
    }

    const plan = calculatePlan(user.weight, user.height, goal);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        goal,
        ...plan,
        onboardingComplete: true,
      },
      { new: true }
    );

    // Generate workout plans
    await WorkoutPlan.deleteMany({ userId: req.user._id });
    const workouts = generateWorkoutPlan(req.user._id, goal);
    await WorkoutPlan.insertMany(workouts);

    res.json({
      goal: updatedUser.goal,
      targetWeight: updatedUser.targetWeight,
      dailyCalories: updatedUser.dailyCalories,
      dailyProtein: updatedUser.dailyProtein,
      onboardingComplete: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      weight: user.weight,
      weightUnit: user.weightUnit,
      height: user.height,
      heightUnit: user.heightUnit,
      age: user.age,
      goal: user.goal,
      targetWeight: user.targetWeight,
      dailyCalories: user.dailyCalories,
      dailyProtein: user.dailyProtein,
      currentStreak: user.currentStreak,
      weeklyWorkoutsDone: user.weeklyWorkoutsDone,
      onboardingComplete: user.onboardingComplete,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/user/profile
const updateProfile = async (req, res) => {
  const { username, age, weight, height } = req.body;
  const updates = {};
  if (username) updates.username = username;
  if (age) updates.age = age;
  if (weight) updates.weight = weight;
  if (height) updates.height = height;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({
      username: user.username,
      age: user.age,
      weight: user.weight,
      height: user.height,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveWeight, saveHeight, saveGoal, getProfile, updateProfile };
