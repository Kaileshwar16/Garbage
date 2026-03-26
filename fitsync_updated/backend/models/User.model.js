const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    // Onboarding data
    weight: { type: Number, default: null },       // kg
    weightUnit: { type: String, enum: ['kg', 'lb'], default: 'kg' },
    height: { type: Number, default: null },       // cm
    heightUnit: { type: String, enum: ['cm', 'inches'], default: 'cm' },
    age: { type: Number, default: null },
    goal: {
      type: String,
      enum: [
        'Strength Training for Muscle Gain',
        'High-Intensity Interval Training for Fat Loss',
        'Cardiovascular Exercise for Fat Loss',
        'Functional Training for Overall Fitness',
      ],
      default: null,
    },
    onboardingComplete: { type: Boolean, default: false },

    // Computed plan fields
    targetWeight: { type: Number, default: null },
    dailyCalories: { type: Number, default: null },
    dailyProtein: { type: Number, default: null },

    // Streak tracking
    currentStreak: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date, default: null },
    weeklyWorkoutsDone: { type: Number, default: 0 },
    weekStartDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
