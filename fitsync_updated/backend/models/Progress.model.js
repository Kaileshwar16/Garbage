const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: { type: Date, default: Date.now },
    weight: { type: Number },
    caloriesBurned: { type: Number, default: 0 },
    workoutsCompleted: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
