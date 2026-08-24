const express = require('express');
const router = express.Router();
const { registerDonor, getDonors, getDonorById, updateDonorStatus } = require('../controllers/donorController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getDonors);
router.get('', getDonors);
router.post('/', optionalAuth, registerDonor);
router.post('', optionalAuth, registerDonor);

router.route('/:id')
  .get(getDonorById);

router.route('/:id/status')
  .put(protect, admin, updateDonorStatus);

module.exports = router;
