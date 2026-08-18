const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer Not to Say'],
      default: 'Male'
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    organsToDonate: [
      {
        type: String,
        enum: ['Kidney', 'Liver', 'Heart', 'Lungs', 'Cornea', 'Pancreas', 'Intestines', 'Tissue']
      }
    ],
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      default: ''
    },
    hospitalPreference: {
      type: String,
      default: 'Nearest Certified Medical Center'
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    medicalHistory: {
      type: String,
      default: 'No major chronic illnesses declared.'
    },
    status: {
      type: String,
      enum: ['Pledged', 'Active', 'Matched', 'Completed', 'Inactive'],
      default: 'Pledged'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Donor', donorSchema);
