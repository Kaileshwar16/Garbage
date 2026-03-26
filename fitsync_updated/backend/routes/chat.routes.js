const express = require('express');
const { sendMessage } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.post('/message', sendMessage);

module.exports = router;
