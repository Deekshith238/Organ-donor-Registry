const mongoose = require('mongoose');

const organRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    patientName: {
      type: String,
      required: true
    },
    patientAge: {
      type: Number,
      required: true
    },
    organType: {
      type: String,
      required: true,
      enum: ['Kidney', 'Liver', 'Heart', 'Lungs', 'Cornea', 'Pancreas', 'Intestines', 'Tissue']
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    urgencyLevel: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'High'
    },
    hospitalName: {
      type: String,
      required: true
    },
    hospitalCity: {
      type: String,
      required: true
    },
    attendingDoctor: {
      type: String,
      default: ''
    },
    contactPhone: {
      type: String,
      required: true
    },
    medicalDetails: {
      type: String,
      default: ''
    },
    matchedDonorId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Donor',
      default: null
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Matching In Progress', 'Matched', 'Fulfilled', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('OrganRequest', organRequestSchema);
