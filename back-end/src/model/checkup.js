import mongoose from 'mongoose';

const checkupSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vitals: {
    systolicBP: {
      type: Number,
      required: [true, 'Systolic BP is required'],
      min: 70,
      max: 250,
    },
    diastolicBP: {
      type: Number,
      required: [true, 'Diastolic BP is required'],
      min: 40,
      max: 150,
    },
    heartRate: {
      type: Number,
      required: [true, 'Heart rate is required'],
      min: 40,
      max: 200,
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: 1,
      max: 500,
    },
    hba1c: {
      type: Number,
      min: 3,
      max: 15,
    },
    fbg: {
      type: Number,
      min: 30,
      max: 600,
    },
  },
  symptoms: [{
    type: String,
    trim: true,
  }],
  diagnosis: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  nextAppointment: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Checkup = mongoose.models.Checkup || mongoose.model('Checkup', checkupSchema);

export default Checkup;