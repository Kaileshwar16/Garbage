const DailyTracking = require('../models/DailyTracking.model');

const todayKey = () => new Date().toISOString().slice(0, 10);

const getOrCreate = async (userId) => {
  const date = todayKey();
  let doc = await DailyTracking.findOne({ userId, date });
  if (!doc) doc = await DailyTracking.create({ userId, date });
  return doc;
};

// GET /api/tracking/today
const getDailyTracking = async (req, res) => {
  try {
    const doc = await getOrCreate(req.user._id);
    res.json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PUT /api/tracking/water  { amount: 0.25 }
const updateWater = async (req, res) => {
  const { amount } = req.body; // delta in liters
  if (typeof amount !== 'number') return res.status(400).json({ message: 'amount required' });
  try {
    const doc = await getOrCreate(req.user._id);
    doc.waterIntake = Math.max(0, Math.min(doc.waterGoal + 2, doc.waterIntake + amount));
    await doc.save();
    res.json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PUT /api/tracking/steps  { steps: 8432 }
const updateSteps = async (req, res) => {
  const { steps } = req.body;
  if (typeof steps !== 'number') return res.status(400).json({ message: 'steps required' });
  try {
    const doc = await getOrCreate(req.user._id);
    doc.steps = Math.max(0, steps);
    await doc.save();
    res.json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// POST /api/tracking/weight  { weight: 72 }
const logWeight = async (req, res) => {
  const { weight } = req.body;
  if (!weight) return res.status(400).json({ message: 'weight required' });
  try {
    const User = require('../models/User.model');
    const user = await User.findByIdAndUpdate(req.user._id, { weight }, { new: true });
    res.json({ weight: user.weight });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getDailyTracking, updateWater, updateSteps, logWeight };
