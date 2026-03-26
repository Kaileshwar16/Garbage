const mongoose = require('mongoose');

const dailyTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  waterIntake: { type: Number, default: 0 },   // liters
  waterGoal:   { type: Number, default: 3.0 },
  steps:       { type: Number, default: 0 },
  stepsGoal:   { type: Number, default: 10000 },
  caloriesBurned: { type: Number, default: 0 },
}, { timestamps: true });

dailyTrackingSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyTracking', dailyTrackingSchema);
