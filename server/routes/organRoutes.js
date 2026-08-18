const express = require('express');
const router = express.Router();
const { getOrgans, getStats, createOrgan } = require('../controllers/organController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getOrgans);
router.get('/stats', getStats);
router.post('/', protect, admin, createOrgan);

module.exports = router;
