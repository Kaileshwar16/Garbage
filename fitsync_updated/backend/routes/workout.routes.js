const express = require('express');
const { getSchedule, getTodayWorkout, completeWorkout, getWorkoutLogs, getPlan } = require('../controllers/workout.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/schedule', getSchedule);
router.get('/today', getTodayWorkout);
router.get('/logs', getWorkoutLogs);
router.post('/complete/:planId', completeWorkout);
router.get('/plan/:planId', getPlan);

module.exports = router;
