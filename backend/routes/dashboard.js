const express = require('express');
const { getStats, applyInsight } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, getStats);
router.post('/apply-insight', protect, applyInsight);

module.exports = router;
