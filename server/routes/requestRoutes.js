const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getRequests);
router.get('', getRequests);
router.post('/', optionalAuth, createRequest);
router.post('', optionalAuth, createRequest);

router.route('/:id/status')
  .put(protect, admin, updateRequestStatus);

module.exports = router;
