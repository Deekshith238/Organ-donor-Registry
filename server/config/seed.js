const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Organ = require('../models/Organ');
const OrganRequest = require('../models/OrganRequest');

const seedData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedDonorPassword = await bcrypt.hash('donor123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    // 1. Sync Demo Users
    const demoUsers = [
      {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a01'),
        name: 'System Administrator',
        email: 'admin@organregistry.org',
        password: hashedAdminPassword,
        role: 'admin',
        bloodGroup: 'O+',
        city: 'Metro Health HQ'
      },
      {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a02'),
        name: 'Deekshith Goud',
        email: 'donor@organregistry.org',
        password: hashedDonorPassword,
        role: 'donor',
        bloodGroup: 'O+',
        city: 'Hyderabad'
      },
      {
        _id: new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a03'),
        name: 'Kola Kishore',
        email: 'recipient@organregistry.org',
        password: hashedUserPassword,
        role: 'recipient',
        bloodGroup: 'A+',
        city: 'Warangal'
      }
    ];

    for (const user of demoUsers) {
      await User.findOneAndUpdate(
        { email: user.email },
        { $set: user },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 2. Clear old legacy donors and insert current code donors
    await Donor.deleteMany({});

    const demoDonors = [
      {
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
        status: 'Pledged'
      },
      {
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
        status: 'Active'
      },
      {
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
        status: 'Pledged'
      },
      {
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
        status: 'Active'
      },
      {
        fullName: 'Deekshith Goud',
        email: 'donor@organregistry.org',
        phone: '+91 9876543210',
        age: 25,
        gender: 'Male',
        bloodGroup: 'O+',
        organsToDonate: ['Kidney', 'Liver'],
        city: 'Hyderabad',
        state: 'Telangana',
        hospitalPreference: 'Apollo Hospital',
        emergencyContact: { name: 'Family Contact', relationship: 'Parent', phone: '+91 9876543211' },
        medicalHistory: 'Healthy donor pledged.',
        status: 'Pledged'
      }
    ];

    await Donor.insertMany(demoDonors);

    // 3. Clear old legacy organs and insert current code organs
    await Organ.deleteMany({});
    const demoOrgans = [
      {
        organType: 'Kidney',
        bloodGroup: 'O+',
        hospitalLocation: 'Northwestern Memorial Hospital',
        preservationWindowHours: 24,
        status: 'Available'
      },
      {
        organType: 'Liver',
        bloodGroup: 'A+',
        hospitalLocation: 'Mount Sinai Hospital',
        preservationWindowHours: 12,
        status: 'Reserved'
      },
      {
        organType: 'Heart',
        bloodGroup: 'B-',
        hospitalLocation: 'UCSF Medical Center',
        preservationWindowHours: 6,
        status: 'Available'
      }
    ];
    await Organ.insertMany(demoOrgans);

    // 4. Clear old legacy requests and insert current code requests
    await OrganRequest.deleteMany({});
    const demoRequests = [
      {
        patientName: 'Koushik',
        patientAge: 30,
        organType: 'Kidney',
        bloodGroup: 'A+',
        urgencyLevel: 'Critical',
        hospitalName: 'Mount Sinai Hospital',
        hospitalCity: 'hyderabad',
        attendingDoctor: 'Dr. eddi reddy',
        contactPhone: '+1 (555) 912-3456',
        medicalDetails: 'Stage 5 Renal Failure, immediate transplant required.',
        status: 'Pending'
      },
      {
        patientName: 'Mukundha',
        patientAge: 23,
        organType: 'Liver',
        bloodGroup: 'O+',
        urgencyLevel: 'High',
        hospitalName: 'CARE Hospital',
        hospitalCity: 'Baltimore',
        attendingDoctor: 'Dr. Michael Chang',
        contactPhone: '+1 (555) 823-4567',
        medicalDetails: 'Hepatic decompensation.',
        status: 'Matching In Progress'
      },
      {
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
        status: 'Matched'
      }
    ];
    await OrganRequest.insertMany(demoRequests);

    console.log('🌱 All updated donor, request, and user records successfully synced to MongoDB!');
  } catch (err) {
    console.warn('⚠️ Seeding warning:', err.message);
  }
};

module.exports = seedData;
