const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  jewelryType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: String,
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  images: [
    {
      url: String,
      name: String,
    }
  ],
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Consultation', consultationSchema); 