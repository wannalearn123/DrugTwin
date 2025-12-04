import Patient from '../model/patient.js';
import Doctor from '../model/doctor.js';
import Checkup from '../model/checkup.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

// Get doctor's assigned patients
export const getMyPatients = async (req, res, next) => {
  try {
    // Find doctor profile by userId
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    const { page = 1, limit = 10, search } = req.query;
    
    const filter = { assignedDoctorId: doctor._id };
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const patients = await Patient.find(filter)
      .populate('userId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Patient.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        patients,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get patient details with checkup history
export const getPatientDetails = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.patientId)
      .populate('userId', 'name email')
      .populate('assignedDoctorId', 'name');

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Get checkup history
    const checkups = await Checkup.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: {
        patient,
        checkups,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create checkup
export const createCheckup = async (req, res, next) => {
  try {
    const { patientId, vitals, symptoms, diagnosis, notes, nextAppointment } = req.body;

    // Validate required fields
    if (!patientId || !vitals) {
      throw new AppError('Patient ID and vitals are required', 400);
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Find doctor profile
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    // Verify doctor is assigned to this patient
    if (patient.assignedDoctorId?.toString() !== doctor._id.toString()) {
      throw new AppError('You are not assigned to this patient', 403);
    }

    const checkup = await Checkup.create({
      patientId,
      doctorId: req.user._id,
      vitals,
      symptoms,
      diagnosis,
      notes,
      nextAppointment,
    });

    logger.info(`Checkup created: ${checkup._id} by doctor: ${req.user.email}`);

    res.status(201).json({
      status: 'success',
      message: 'Checkup saved successfully',
      data: { checkup },
    });
  } catch (error) {
    next(error);
  }
};

// Get checkup history for a patient
export const getCheckupHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const checkups = await Checkup.find({ patientId })
      .populate('doctorId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Checkup.countDocuments({ patientId });

    res.status(200).json({
      status: 'success',
      data: {
        checkups,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};