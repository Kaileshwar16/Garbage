const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getDailyTracking, updateWater, updateSteps, logWeight
} = require('../controllers/tracking.controller');

const router = express.Router();
router.use(protect);

router.get('/today', getDailyTracking);
router.put('/water', updateWater);
router.put('/steps', updateSteps);
router.post('/weight', logWeight);

module.exports = router;
