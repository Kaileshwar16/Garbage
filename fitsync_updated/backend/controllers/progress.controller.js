const Progress = require('../models/Progress.model');
const { WorkoutLog } = require('../models/Workout.model');
const User = require('../models/User.model');

// GET /api/progress/stats
const getStats = async (req, res) => {
  try {
    const user = req.user;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progressLogs = await Progress.find({ userId: user._id, date: { $gte: thirtyDaysAgo } });
    const totalCalories = progressLogs.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);
    const totalWorkouts = await WorkoutLog.countDocuments({ userId: user._id });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyLogs = await WorkoutLog.find({ userId: user._id, date: { $gte: sevenDaysAgo } }).sort({ date: 1 });

    const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const weeklyData = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = DAYS[((d.getDay() + 6) % 7)];
      weeklyData[key] = { calories: 0, duration: 0, count: 0 };
    }

    weeklyLogs.forEach((log) => {
      const d = new Date(log.date);
      const key = DAYS[((d.getDay() + 6) % 7)];
      if (weeklyData[key] !== undefined) {
        weeklyData[key].calories += log.caloriesBurned || 0;
        weeklyData[key].duration += log.duration || 0;
        weeklyData[key].count += 1;
      }
    });

    const weeklyArr = Object.entries(weeklyData).map(([day, v]) => ({ day, ...v }));
    const totalDuration = weeklyArr.reduce((s, d) => s + d.duration, 0);
    const weeklyAvgMinutes = Math.round(totalDuration / 7);

    // Monthly data
    const monthlyLogs = await WorkoutLog.find({ userId: user._id, date: { $gte: thirtyDaysAgo } }).sort({ date: 1 });
    const monthlyData = { 'W1': 0, 'W2': 0, 'W3': 0, 'W4': 0 };
    monthlyLogs.forEach((log) => {
      const diff = Math.floor((Date.now() - new Date(log.date).getTime()) / (1000 * 60 * 60 * 24));
      const week = diff < 7 ? 'W4' : diff < 14 ? 'W3' : diff < 21 ? 'W2' : 'W1';
      monthlyData[week] += log.duration || 0;
    });
    const monthlyArr = Object.entries(monthlyData).map(([week, duration]) => ({ day: week, duration, calories: 0 }));

    res.json({
      totalCaloriesBurned: totalCalories,
      totalWorkouts,
      currentStreak: user.currentStreak,
      weeklyWorkoutsDone: user.weeklyWorkoutsDone,
      weeklyCalories: weeklyArr,
      weeklyPerformance: weeklyArr,
      monthlyPerformance: monthlyArr,
      weeklyAvgMinutes,
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
