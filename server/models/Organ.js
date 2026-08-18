const mongoose = require('mongoose');

const organSchema = new mongoose.Schema(
  {
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
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor'
    },
    hospitalLocation: {
      type: String,
      required: true
    },
    preservationWindowHours: {
      type: Number,
      default: 24
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Transplanted', 'Expired'],
      default: 'Available'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Organ', organSchema);
