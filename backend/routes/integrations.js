const express = require('express');
const { getConnectedAccounts, connectAccount, disconnectAccount } = require('../controllers/integrationsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getConnectedAccounts);
router.post('/:platform/connect', protect, connectAccount);
router.delete('/:platform/disconnect', protect, disconnectAccount);

module.exports = router;
