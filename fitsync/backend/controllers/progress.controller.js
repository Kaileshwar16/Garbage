const Progress = require('../models/Progress.model');
const { WorkoutLog } = require('../models/Workout.model');
const User = require('../models/User.model');

// GET /api/progress/stats
const getStats = async (req, res) => {
  try {
    const user = req.user;

    // Total calories burned (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progressLogs = await Progress.find({
      userId: user._id,
      date: { $gte: thirtyDaysAgo },
    });

    const totalCalories = progressLogs.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);
    const totalWorkouts = await WorkoutLog.countDocuments({ userId: user._id });

    // Weekly calories burned (last 7 days, per day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyLogs = await WorkoutLog.find({
      userId: user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    // Group by day
    const weeklyData = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { weekday: 'short' });
      weeklyData[key] = 0;
    }
    weeklyLogs.forEach((log) => {
      const key = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (weeklyData[key] !== undefined) {
        weeklyData[key] += log.caloriesBurned || 0;
      }
    });

    res.json({
      totalCaloriesBurned: totalCalories,
      totalWorkouts,
      currentStreak: user.currentStreak,
      weeklyWorkoutsDone: user.weeklyWorkoutsDone,
      weeklyCalories: Object.entries(weeklyData).map(([day, calories]) => ({ day, calories })),
      currentWeight: user.weight,
      targetWeight: user.targetWeight,
      dailyCalorieGoal: user.dailyCalories,
      dailyProteinGoal: user.dailyProtein,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
