const express = require('express');
const { getRecentPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/recent', protect, getRecentPosts);

module.exports = router;
