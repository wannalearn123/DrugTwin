import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true,
  },
  specialties: [{
    type: String,
    required: true,
    trim: true,
  }],
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
  }],
  experienceYears: {
    type: Number,
    default: 0,
  },
  consultationFee: {
    type: Number,
    default: 0,
  },
  availableSlots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: String,
    endTime: String,
  }],
  assignedPatients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

export default Doctor;