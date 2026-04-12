const express = require('express');
const { getIntegrations, connectIntegration, disconnectIntegration, getIntegrationStats } = require('../controllers/integrationsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getIntegrations);
router.post('/connect', protect, connectIntegration);
router.post('/disconnect', protect, disconnectIntegration);
router.get('/:platform/stats', protect, getIntegrationStats);

module.exports = router;
