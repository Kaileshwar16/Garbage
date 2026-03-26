const { WorkoutPlan, WorkoutLog } = require('../models/Workout.model');
const User = require('../models/User.model');
const Progress = require('../models/Progress.model');

// GET /api/workouts/schedule
const getSchedule = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.user._id }).sort({ day: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts/today
const getTodayWorkout = async (req, res) => {
  try {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const workout = await WorkoutPlan.findOne({ userId: req.user._id, day: today });
    if (!workout) {
      return res.json({ message: 'Rest day today! Recovery is part of the plan.', restDay: true });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workouts/complete/:planId
const completeWorkout = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.planId, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Workout not found' });

    // Log it
    const log = await WorkoutLog.create({
      userId: req.user._id,
      workoutPlanId: plan._id,
      title: plan.title,
      duration: plan.duration,
      caloriesBurned: plan.caloriesBurned,
      exercises: plan.exercises,
    });

    // Update streak & weekly count
    const user = await User.findById(req.user._id);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if workout was already done today
    const existingLog = await WorkoutLog.findOne({
      userId: req.user._id,
      date: { $gte: today },
      _id: { $ne: log._id },
    });

    if (!existingLog) {
      // Update streak
      let newStreak = user.currentStreak;
      if (user.lastWorkoutDate) {
        const lastDate = new Date(user.lastWorkoutDate);
        const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        const diffDays = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));
        newStreak = diffDays === 1 ? newStreak + 1 : diffDays === 0 ? newStreak : 1;
      } else {
        newStreak = 1;
      }

      // Weekly count reset
      let weeklyDone = user.weeklyWorkoutsDone;
      const weekStart = user.weekStartDate ? new Date(user.weekStartDate) : null;
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

      if (!weekStart || weekStart < monday) {
        weeklyDone = 1;
      } else {
        weeklyDone += 1;
      }

      await User.findByIdAndUpdate(req.user._id, {
        currentStreak: newStreak,
        lastWorkoutDate: now,
        weeklyWorkoutsDone: weeklyDone,
        weekStartDate: monday,
      });

      // Save progress
      await Progress.create({
        userId: req.user._id,
        caloriesBurned: plan.caloriesBurned,
        workoutsCompleted: 1,
      });
    }

    const updatedUser = await User.findById(req.user._id);
    res.json({
      log,
      streak: updatedUser.currentStreak,
      weeklyWorkoutsDone: updatedUser.weeklyWorkoutsDone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts/logs
const getWorkoutLogs = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(20);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts/plan/:planId
const getPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ _id: req.params.planId, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getSchedule, getTodayWorkout, completeWorkout, getWorkoutLogs, getPlan };
