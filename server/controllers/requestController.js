const mongoose = require('mongoose');
const OrganRequest = require('../models/OrganRequest');
const Donor = require('../models/Donor');

let mockRequests = [
  {
    _id: 'req_201',
    patientName: 'Honey',
    patientAge: 22,
    organType: 'Liver',
    bloodGroup: 'B+',
    urgencyLevel: 'Critical',
    hospitalName: 'OMC Hospital',
    hospitalCity: 'Warangal',
    attendingDoctor: 'Dr. eddi reddy',
    contactPhone: '+1 (555) 912-3456',
    medicalDetails: 'Stage 5 Renal Failure, immediate transplant required.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    _id: 'req_202',
    patientName: 'varsha',
    patientAge: 20,
    organType: 'Kidney',
    bloodGroup: 'O+',
    urgencyLevel: 'High',
    hospitalName: ' CARE Hospital',
    hospitalCity: 'warangal',
    attendingDoctor: 'Dr. Michael Chang',
    contactPhone: '+1 (555) 823-4567',
    medicalDetails: 'Hepatic decompensation.',
    status: 'Matching In Progress',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    _id: 'req_203',
    patientName: 'Deekshitha',
    patientAge: 20,
    organType: 'Heart',
    bloodGroup: 'B-',
    urgencyLevel: 'Critical',
    hospitalName: 'Yashoda Hospital',
    hospitalCity: 'Madhapur',
    attendingDoctor: 'Dr. Sarah Connor',
    contactPhone: '+1 (555) 734-5678',
    medicalDetails: 'End-stage cardiomyopathy.',
    status: 'Matched',
    matchedDonorId: 'dnr_103',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];

// @desc    Submit organ request
// @route   POST /api/requests
// @access  Private / Public
const createRequest = async (req, res) => {
  try {
    const {
      patientName,
      patientAge,
      organType,
      bloodGroup,
      urgencyLevel,
      hospitalName,
      hospitalCity,
      attendingDoctor,
      contactPhone,
      medicalDetails
    } = req.body;

    if (!patientName || !patientAge || !organType || !bloodGroup || !hospitalName || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient name, age, organ type, blood group, hospital, and contact phone.'
      });
    }

    const requestData = {
      userId: (req.user && req.user.id && mongoose.Types.ObjectId.isValid(req.user.id)) ? req.user.id : null,
      patientName,
      patientAge: Number(patientAge),
      organType,
      bloodGroup,
      urgencyLevel: urgencyLevel || 'High',
      hospitalName,
      hospitalCity: hospitalCity || 'Not Specified',
      attendingDoctor: attendingDoctor || '',
      contactPhone,
      medicalDetails: medicalDetails || '',
      status: 'Pending'
    };

    let organRequest;
    try {
      organRequest = await OrganRequest.create(requestData);
    } catch (e) {
      organRequest = {
        _id: 'req_' + Date.now(),
        ...requestData,
        createdAt: new Date().toISOString()
      };
      mockRequests.unshift(organRequest);
    }

    res.status(201).json({
      success: true,
      message: 'Organ Request submitted successfully!',
      request: organRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all organ requests (Admin / User filter)
// @route   GET /api/requests
// @access  Public
const getRequests = async (req, res) => {
  try {
    const { urgency, organ, bloodGroup, status } = req.query;

    let dbRequests = [];
    try {
      const query = {};
      if (urgency) query.urgencyLevel = urgency;
      if (organ) query.organType = organ;
      if (bloodGroup) query.bloodGroup = bloodGroup;
      if (status) query.status = status;

      dbRequests = await OrganRequest.find(query).sort({ createdAt: -1 });
    } catch (e) {
      dbRequests = [];
    }

    let allRequests = dbRequests.length > 0 ? dbRequests : mockRequests;

    if (urgency) allRequests = allRequests.filter(r => r.urgencyLevel === urgency);
    if (organ) allRequests = allRequests.filter(r => r.organType === organ);
    if (bloodGroup) allRequests = allRequests.filter(r => r.bloodGroup === bloodGroup);
    if (status) allRequests = allRequests.filter(r => r.status === status);

    res.json({
      success: true,
      count: allRequests.length,
      requests: allRequests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update request status or assign matched donor
// @route   PUT /api/requests/:id/status
// @access  Private / Admin
const updateRequestStatus = async (req, res) => {
  try {
    const { status, matchedDonorId } = req.body;

    let organRequest;
    try {
      const updateData = { status };
      if (matchedDonorId) updateData.matchedDonorId = matchedDonorId;
      organRequest = await OrganRequest.findByIdAndUpdate(req.params.id, updateData, { new: true });
    } catch (e) {
      const idx = mockRequests.findIndex(r => r._id === req.params.id);
      if (idx !== -1) {
        mockRequests[idx].status = status;
        if (matchedDonorId) mockRequests[idx].matchedDonorId = matchedDonorId;
        organRequest = mockRequests[idx];
      }
    }

    if (!organRequest) {
      const idx = mockRequests.findIndex(r => r._id === req.params.id);
      if (idx !== -1) {
        mockRequests[idx].status = status;
        if (matchedDonorId) mockRequests[idx].matchedDonorId = matchedDonorId;
        organRequest = mockRequests[idx];
      }
    }

    if (!organRequest) {
      return res.status(404).json({ success: false, message: 'Organ request not found' });
    }

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
      request: organRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus
};
