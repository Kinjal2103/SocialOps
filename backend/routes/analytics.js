const express = require('express');
const { getOverview, getGrowth, getFull } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/overview', protect, getOverview);
// ADDED
router.get('/growth', protect, getGrowth);
router.get('/full', protect, getFull);

module.exports = router;
