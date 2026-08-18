const mongoose = require('mongoose');
const Donor = require('../models/Donor');
const User = require('../models/User');

// Seed mock donors array for memory fallback mode
let mockDonors = [
  {
    _id: 'dnr_101',
    fullName: 'Kola Kishore',
    email: 'kola.k@example.com',
    phone: '+1 (555) 234-5678',
    age: 29,
    gender: 'Female',
    bloodGroup: 'O+',
    organsToDonate: ['Kidney', 'Cornea', 'Liver'],
    city: 'Chicago',
    state: 'IL',
    hospitalPreference: 'Northwestern Memorial Hospital',
    emergencyContact: { name: 'Mark Jenkins', relationship: 'Spouse', phone: '+1 (555) 987-6543' },
    medicalHistory: 'No chronic diseases, non-smoker.',
    status: 'Pledged',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'dnr_102',
    fullName: 'Pintu',
    email: 'Pintu.m@example.com',
    phone: '+1 (555) 345-6789',
    age: 42,
    gender: 'Male',
    bloodGroup: 'A+',
    organsToDonate: ['Heart', 'Lungs', 'Kidney', 'Tissue'],
    city: 'New York',
    state: 'NY',
    hospitalPreference: 'Mount Sinai Hospital',
    emergencyContact: { name: 'Laura Miller', relationship: 'Sister', phone: '+1 (555) 876-5432' },
    medicalHistory: 'Mild asthma, otherwise healthy.',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    _id: 'dnr_103',
    fullName: 'Sri Ram',
    email: 'sri.ram@example.com',
    phone: '+1 (555) 456-7890',
    age: 35,
    gender: 'Female',
    bloodGroup: 'B-',
    organsToDonate: ['Liver', 'Pancreas'],
    city: 'San Francisco',
    state: 'CA',
    hospitalPreference: 'UCSF Medical Center',
    emergencyContact: { name: 'Alexei Rostov', relationship: 'Brother', phone: '+1 (555) 765-4321' },
    medicalHistory: 'Clear medical history.',
    status: 'Pledged',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'dnr_104',
    fullName: 'Prashanth',
    email: 'prashanth.v@example.com',
    phone: '+1 (555) 567-8901',
    age: 38,
    gender: 'Male',
    bloodGroup: 'AB+',
    organsToDonate: ['Cornea', 'Tissue', 'Kidney'],
    city: 'Dallas',
    state: 'TX',
    hospitalPreference: 'UT Southwestern Medical Center',
    emergencyContact: { name: 'Chloe Vance', relationship: 'Wife', phone: '+1 (555) 654-3210' },
    medicalHistory: 'Regular donor, verified bloodwork.',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

// @desc    Register new donor pledge
// @route   POST /api/donors
// @access  Private / Public
const registerDonor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      organsToDonate,
      city,
      state,
      hospitalPreference,
      emergencyContact,
      medicalHistory
    } = req.body;

    if (!fullName || !email || !phone || !bloodGroup || !organsToDonate || organsToDonate.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone, blood group, and at least one organ to donate.'
      });
    }

    const donorData = {
      userId: (req.user && req.user.id && mongoose.Types.ObjectId.isValid(req.user.id)) ? req.user.id : null,
      fullName,
      email,
      phone,
      age: Number(age) || 25,
      gender: gender || 'Male',
      bloodGroup,
      organsToDonate,
      city: city || 'Not Specified',
      state: state || '',
      hospitalPreference: hospitalPreference || 'Nearest Certified Center',
      emergencyContact: emergencyContact || { name: '', relationship: '', phone: '' },
      medicalHistory: medicalHistory || 'Clean history.',
      status: 'Pledged'
    };

    let donor;
    try {
      donor = await Donor.create(donorData);
    } catch (e) {
      // Memory fallback
      donor = {
        _id: 'dnr_' + Date.now(),
        ...donorData,
        createdAt: new Date().toISOString()
      };
      mockDonors.unshift(donor);
    }

    res.status(201).json({
      success: true,
      message: 'Organ Donor Pledge registered successfully!',
      donor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all donors (with search & filter query params)
// @route   GET /api/donors
// @access  Public
const getDonors = async (req, res) => {
  try {
    const { organ, bloodGroup, city, status } = req.query;

    let dbDonors = [];
    try {
      const query = {};
      if (organ) query.organsToDonate = { $in: [organ] };
      if (bloodGroup) query.bloodGroup = bloodGroup;
      if (city) query.city = new RegExp(city, 'i');
      if (status) query.status = status;

      dbDonors = await Donor.find(query).sort({ createdAt: -1 });
    } catch (e) {
      dbDonors = [];
    }

    // Combine DB + fallback mock donors if DB is empty or offline
    let allDonors = dbDonors.length > 0 ? dbDonors : mockDonors;

    // Apply JS filters for fallback arrays
    if (organ) {
      allDonors = allDonors.filter(d => d.organsToDonate && d.organsToDonate.includes(organ));
    }
    if (bloodGroup) {
      allDonors = allDonors.filter(d => d.bloodGroup === bloodGroup);
    }
    if (city) {
      allDonors = allDonors.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (status) {
      allDonors = allDonors.filter(d => d.status === status);
    }

    res.json({
      success: true,
      count: allDonors.length,
      donors: allDonors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donor by ID
// @route   GET /api/donors/:id
// @access  Public
const getDonorById = async (req, res) => {
  try {
    let donor;
    try {
      donor = await Donor.findById(req.params.id);
    } catch (e) {
      donor = mockDonors.find(d => d._id === req.params.id);
    }

    if (!donor) {
      donor = mockDonors.find(d => d._id === req.params.id);
    }

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor record not found' });
    }

    res.json({ success: true, donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update donor status (Admin)
// @route   PUT /api/donors/:id/status
// @access  Private / Admin
const updateDonorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let donor;

    try {
      donor = await Donor.findByIdAndUpdate(req.params.id, { status }, { new: true });
    } catch (e) {
      const idx = mockDonors.findIndex(d => d._id === req.params.id);
      if (idx !== -1) {
        mockDonors[idx].status = status;
        donor = mockDonors[idx];
      }
    }

    if (!donor) {
      const idx = mockDonors.findIndex(d => d._id === req.params.id);
      if (idx !== -1) {
        mockDonors[idx].status = status;
        donor = mockDonors[idx];
      }
    }

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    res.json({ success: true, message: `Donor status updated to ${status}`, donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerDonor,
  getDonors,
  getDonorById,
  updateDonorStatus
};
