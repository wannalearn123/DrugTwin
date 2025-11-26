import Patient from '../model/patient.js';
import Doctor from '../model/doctor.js';
import User from '../model/user.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

// ============ PATIENT CRUD ============

// Create Patient
export const createPatient = async (req, res, next) => {
  try {
    const { userId, name, dateOfBirth, phone, bloodType, allergies, emergencyContact } = req.body;

    // Validate required fields
    if (!userId || !name || !dateOfBirth || !phone) {
      throw new AppError('userId, name, dateOfBirth, and phone are required', 400);
    }

    // Check if user exists and has patient role
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if (user.role !== 'patient') {
      throw new AppError('User must have patient role', 400);
    }

    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({ userId });
    if (existingPatient) {
      throw new AppError('Patient profile already exists for this user', 409);
    }

    const patient = await Patient.create({
      userId,
      name,
      dateOfBirth,
      phone,
      bloodType,
      allergies,
      emergencyContact,
    });

    logger.info(`Patient created: ${patient._id} by admin: ${req.user.email}`);

    res.status(201).json({
      status: 'success',
      message: 'Patient created successfully',
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

// Get All Patients
export const getAllPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const patients = await Patient.find(filter)
      .populate('userId', 'name email')
      .populate('assignedDoctorId', 'name email')
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

// Get Single Patient
export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedDoctorId', 'name email licenseNumber');

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

// Update Patient
export const updatePatient = async (req, res, next) => {
  try {
    const { name, dateOfBirth, phone, bloodType, allergies, emergencyContact } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, dateOfBirth, phone, bloodType, allergies, emergencyContact },
      { new: true, runValidators: true }
    );

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    logger.info(`Patient updated: ${patient._id} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Patient updated successfully',
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

// Delete Patient
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    logger.info(`Patient deleted: ${patient._id} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ============ DOCTOR CRUD ============

// Create Doctor
export const createDoctor = async (req, res, next) => {
  try {
    const { userId, licenseNumber, specialties, qualifications, experienceYears, consultationFee } = req.body;

    // Validate required fields
    if (!userId || !licenseNumber || !specialties || specialties.length === 0) {
      throw new AppError('userId, licenseNumber, and specialties are required', 400);
    }

    // Check if user exists and has doctor role
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if (user.role !== 'doctor') {
      throw new AppError('User must have doctor role', 400);
    }

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      throw new AppError('Doctor profile already exists for this user', 409);
    }

    const doctor = await Doctor.create({
      userId,
      licenseNumber,
      specialties,
      qualifications,
      experienceYears,
      consultationFee,
    });

    logger.info(`Doctor created: ${doctor._id} by admin: ${req.user.email}`);

    res.status(201).json({
      status: 'success',
      message: 'Doctor created successfully',
      data: { doctor },
    });
  } catch (error) {
    next(error);
  }
};

// Get All Doctors
export const getAllDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, specialty, isActive } = req.query;

    const filter = {};
    if (specialty) {
      filter.specialties = { $in: [specialty] };
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Doctor.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        doctors,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Doctor
export const getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedPatients', 'name phone');

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { doctor },
    });
  } catch (error) {
    next(error);
  }
};

// Update Doctor
export const updateDoctor = async (req, res, next) => {
  try {
    const { licenseNumber, specialties, qualifications, experienceYears, consultationFee, availableSlots } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { licenseNumber, specialties, qualifications, experienceYears, consultationFee, availableSlots },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    logger.info(`Doctor updated: ${doctor._id} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Doctor updated successfully',
      data: { doctor },
    });
  } catch (error) {
    next(error);
  }
};

// Delete Doctor
export const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    logger.info(`Doctor deleted: ${doctor._id} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ============ ASSIGN DOCTOR TO PATIENT ============

export const assignDoctor = async (req, res, next) => {
  try {
    const { patientId, doctorId } = req.body;

    // Validate required fields
    if (!patientId || !doctorId) {
      throw new AppError('patientId and doctorId are required', 400);
    }

    // Find patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Check if doctor is active
    if (!doctor.isActive) {
      throw new AppError('Cannot assign inactive doctor', 400);
    }

    // Remove patient from previous doctor's list if exists
    if (patient.assignedDoctorId) {
      await Doctor.findByIdAndUpdate(
        patient.assignedDoctorId,
        { $pull: { assignedPatients: patientId } }
      );
    }

    // Assign doctor to patient
    patient.assignedDoctorId = doctorId;
    await patient.save();

    // Add patient to doctor's assigned patients
    if (!doctor.assignedPatients.includes(patientId)) {
      doctor.assignedPatients.push(patientId);
      await doctor.save();
    }

    logger.info(`Doctor ${doctorId} assigned to patient ${patientId} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Doctor assigned to patient successfully',
      data: {
        patient: await Patient.findById(patientId).populate('assignedDoctorId', 'licenseNumber specialties'),
      },
    });
  } catch (error) {
    next(error);
  }
};