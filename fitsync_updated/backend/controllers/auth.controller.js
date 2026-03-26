const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User.model');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
        weight: user.weight,
        height: user.height,
        age: user.age,
        goal: user.goal,
        targetWeight: user.targetWeight,
        dailyCalories: user.dailyCalories,
        dailyProtein: user.dailyProtein,
        currentStreak: user.currentStreak,
        weeklyWorkoutsDone: user.weeklyWorkoutsDone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      onboardingComplete: user.onboardingComplete,
      weight: user.weight,
      height: user.height,
      age: user.age,
      goal: user.goal,
      targetWeight: user.targetWeight,
      dailyCalories: user.dailyCalories,
      dailyProtein: user.dailyProtein,
      currentStreak: user.currentStreak,
      weeklyWorkoutsDone: user.weeklyWorkoutsDone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
