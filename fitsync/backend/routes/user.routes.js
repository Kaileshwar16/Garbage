const express = require('express');
const { saveWeight, saveHeight, saveGoal, getProfile, updateProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/onboarding/weight', saveWeight);
router.put('/onboarding/height', saveHeight);
router.put('/onboarding/goal', saveGoal);

module.exports = router;
