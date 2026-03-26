const User = require('../models/User.model');

// Simple rule-based fitness chatbot (no 3rd party AI)
const getFitnessResponse = (message, user) => {
  const msg = message.toLowerCase().trim();

  // Greeting
  if (/^(hi|hello|hey|sup|yo)\b/.test(msg)) {
    return `Hey ${user.username}! 💪 Ready to crush your fitness goals? Ask me about your workout plan, nutrition tips, or progress!`;
  }

  // Workout plan
  if (msg.includes('workout') && (msg.includes('plan') || msg.includes('today') || msg.includes('schedule'))) {
    const goal = user.goal || 'your goal';
    return `Your current program is focused on **${goal}**. You train 3 days a week with structured sessions. Check the Schedule tab to see your full weekly plan and start today's session! 🏋️`;
  }

  // Nutrition
  if (msg.includes('nutrition') || msg.includes('diet') || msg.includes('eat') || msg.includes('food') || msg.includes('meal')) {
    const calories = user.dailyCalories || '2000';
    const protein = user.dailyProtein || '150';
    return `Based on your goal, you should aim for **${calories} calories/day** with **${protein}g protein**. Focus on lean proteins (chicken, fish, eggs), complex carbs (oats, rice, sweet potato), and healthy fats (avocado, nuts). Stay hydrated — aim for 2-3L of water daily! 🥗`;
  }

  // Calories
  if (msg.includes('calorie') || msg.includes('calories')) {
    const calories = user.dailyCalories || '2000';
    return `Your daily calorie target is **${calories} kcal**. This is calculated based on your weight, height, and fitness goal to help you ${user.goal?.includes('Loss') ? 'lose fat' : 'build muscle'} effectively. Track your meals to stay on target! 🔥`;
  }

  // Protein
  if (msg.includes('protein')) {
    const protein = user.dailyProtein || '150';
    return `Aim for **${protein}g of protein per day**. Great sources: chicken breast (31g/100g), eggs (6g each), Greek yogurt (10g/100g), tuna (25g/100g), and whey protein shakes. Try to spread protein across 4-5 meals. 🥩`;
  }

  // Weight
  if (msg.includes('weight') || msg.includes('lose') || msg.includes('gain')) {
    const current = user.weight || '?';
    const target = user.targetWeight || '?';
    return `You're currently at **${current}kg**, with a target of **${target}kg**. Consistency is key — stick to your workout schedule and nutrition plan, and you'll see results within 4-6 weeks! 📉`;
  }

  // Streak
  if (msg.includes('streak') || msg.includes('progress')) {
    const streak = user.currentStreak || 0;
    return `You're on a **${streak}-day streak** — ${streak > 5 ? 'amazing consistency! 🔥' : streak > 0 ? 'keep it going!' : "let's start building one today!"} Check the Stats tab for your full progress overview. 📊`;
  }

  // Rest / recovery
  if (msg.includes('rest') || msg.includes('recover') || msg.includes('sore')) {
    return `Recovery is just as important as training! Make sure you're getting 7-9 hours of sleep, staying hydrated, and doing light stretching on rest days. Muscle soreness (DOMS) is normal — it means you're making progress! 😴`;
  }

  // Motivation
  if (msg.includes('motivat') || msg.includes('tired') || msg.includes('give up') || msg.includes('hard')) {
    const quotes = [
      "Every expert was once a beginner. Keep going! 💪",
      "The only bad workout is the one that didn't happen.",
      "Your future self will thank you for showing up today. 🏆",
      "Progress, not perfection. You've got this!",
      "Pain is temporary. Pride is forever. 🔥",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Cardio
  if (msg.includes('cardio') || msg.includes('run') || msg.includes('cycling') || msg.includes('swim')) {
    return `Cardio is great for heart health and fat burning. For your goal, aim for 2-3 cardio sessions per week, keeping your heart rate at 60-80% of your max (roughly 220 minus your age). LISS (low-intensity steady state) is ideal for recovery days! 🏃`;
  }

  // Supplements
  if (msg.includes('supplement') || msg.includes('creatine') || msg.includes('protein powder') || msg.includes('whey')) {
    return `The most evidence-backed supplements are: **Creatine Monohydrate** (3-5g/day for strength), **Whey Protein** (to hit protein targets), and **Vitamin D** (especially if you train indoors). Always prioritize whole foods first — supplements fill the gaps. 💊`;
  }

  // Default
  return `I'm Pulse, your AI fitness companion! 🤖 I can help with:\n• **Workout plans** — ask about today's session\n• **Nutrition tips** — calories, protein, meal advice\n• **Progress** — streaks, stats, weight goals\n• **Recovery** — rest days, sleep, soreness\n\nWhat would you like to know?`;
};

// POST /api/chat/message
const sendMessage = async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }
  if (message.length > 500) {
    return res.status(400).json({ message: 'Message too long (max 500 characters)' });
  }

  try {
    const user = req.user;
    const response = getFitnessResponse(message, user);
    res.json({
      userMessage: message,
      botResponse: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage };
