const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number },
  reps: { type: Number },
  duration: { type: Number }, // minutes
  notes: { type: String },
});

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    exercises: [exerciseSchema],
    caloriesBurned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const workoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
    },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    duration: { type: Number },
    caloriesBurned: { type: Number, default: 0 },
    exercises: [exerciseSchema],
    completed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);

module.exports = { WorkoutPlan, WorkoutLog };
