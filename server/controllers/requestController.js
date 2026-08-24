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
    attendingDoctor: 'Dr. Eddi Reddy',
    contactPhone: '+91 9876543210',
    medicalDetails: 'End-stage liver disease, immediate transplant required.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    _id: 'req_202',
    patientName: 'Varsha',
    patientAge: 20,
    organType: 'Kidney',
    bloodGroup: 'O+',
    urgencyLevel: 'High',
    hospitalName: 'CARE Hospital',
    hospitalCity: 'Warangal',
    attendingDoctor: 'Dr. Michael Chang',
    contactPhone: '+91 9876543211',
    medicalDetails: 'Stage 5 chronic kidney disease, transplant required.',
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
    contactPhone: '+91 9876543212',
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

    if (
      !patientName ||
      !patientAge ||
      !organType ||
      !bloodGroup ||
      !hospitalName ||
      !contactPhone
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide patient name, age, organ type, blood group, hospital, and contact phone.'
      });
    }

    const requestData = {
      userId:
        req.user &&
        req.user.id &&
        mongoose.Types.ObjectId.isValid(req.user.id)
          ? req.user.id
          : null,

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
    } catch (error) {
      // Fallback only when MongoDB is unavailable
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all organ requests
// @route   GET /api/requests
// @access  Public
const getRequests = async (req, res) => {
  try {
    const {
      urgency,
      organ,
      bloodGroup,
      status
    } = req.query;

    const query = {};

    if (urgency) {
      query.urgencyLevel = urgency;
    }

    if (organ) {
      query.organType = organ;
    }

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (status) {
      query.status = status;
    }

    let allRequests;

    try {
      // MongoDB is the primary source of truth
      allRequests = await OrganRequest
        .find(query)
        .sort({ createdAt: -1 });

      // If MongoDB is empty, use mock data
      if (allRequests.length === 0) {
        allRequests = mockRequests.filter(request => {
          if (urgency && request.urgencyLevel !== urgency) return false;
          if (organ && request.organType !== organ) return false;
          if (bloodGroup && request.bloodGroup !== bloodGroup) return false;
          if (status && request.status !== status) return false;

          return true;
        });
      }
    } catch (error) {
      // MongoDB unavailable → fallback to mock data
      allRequests = mockRequests.filter(request => {
        if (urgency && request.urgencyLevel !== urgency) return false;
        if (organ && request.organType !== organ) return false;
        if (bloodGroup && request.bloodGroup !== bloodGroup) return false;
        if (status && request.status !== status) return false;

        return true;
      });
    }

    res.json({
      success: true,
      count: allRequests.length,
      requests: allRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update request status or assign matched donor
// @route   PUT /api/requests/:id/status
// @access  Private / Admin
const updateRequestStatus = async (req, res) => {
  try {
    const {
      status,
      matchedDonorId
    } = req.body;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      try {
        const updateData = { status };

        if (matchedDonorId !== undefined) {
          updateData.matchedDonorId = matchedDonorId;
        }

        organRequest = await OrganRequest.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );
      } catch (error) {
        organRequest = null;
      }
    }

    if (!organRequest) {
      const index = mockRequests.findIndex(
        request => request._id === req.params.id
      );

      if (index !== -1) {
        mockRequests[index].status = status;

        if (matchedDonorId !== undefined) {
          mockRequests[index].matchedDonorId = matchedDonorId;
        }

        organRequest = mockRequests[index];
      }
    }

    if (!organRequest) {
      return res.status(404).json({
        success: false,
        message: 'Organ request not found'
      });
    }

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
      request: organRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus
};