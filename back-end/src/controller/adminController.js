import Patient from '../model/Patient.js';
import Doctor from '../model/Doctor.js';
import User from '../model/User.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

// ==================== PATIENT MANAGEMENT ====================

// Create Patient
export const createPatient = async (req, res, next) => {
  try {
    const { userId, name, dateOfBirth, phone, bloodType, allergies, emergencyContact, assignedDoctorId } = req.body;

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
      assignedDoctorId,
    });

    await patient.populate('userId', 'name email');
    await patient.populate('assignedDoctorId', 'name specialization');

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
export const getPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive, search } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const patients = await Patient.find(filter)
      .populate('userId', 'name email')
      .populate('assignedDoctorId', 'name specialization')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Patient.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        patients,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
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
      .populate('assignedDoctorId', 'name specialization licenseNumber');

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
    const { name, dateOfBirth, phone, bloodType, allergies, emergencyContact, assignedDoctorId } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, dateOfBirth, phone, bloodType, allergies, emergencyContact, assignedDoctorId },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email')
      .populate('assignedDoctorId', 'name specialization');

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

// ==================== DOCTOR MANAGEMENT ====================

// Create Doctor
export const createDoctor = async (req, res, next) => {
  try {
    const { userId, name, specialization, licenseNumber, phone } = req.body;

    // Validate required fields
    if (!userId || !name || !specialization || !licenseNumber) {
      throw new AppError('Please provide all required fields', 400);
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
      throw new AppError('Doctor profile already exists for this user', 400);
    }

    // Check license number uniqueness
    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) {
      throw new AppError('License number already registered', 400);
    }

    const doctor = await Doctor.create({
      userId,
      name,
      specialization,
      licenseNumber,
      phone,
    });

    await doctor.populate('userId', 'name email');

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
export const getDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, specialization, isActive } = req.query;

    const filter = {};
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    if (specialization) {
      filter.specialization = specialization;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email isActive')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Doctor.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        doctors,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
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
      .populate('userId', 'name email isActive');

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Get assigned patients count
    const patientCount = await Patient.countDocuments({ 
      assignedDoctorId: doctor._id 
    });

    res.status(200).json({
      status: 'success',
      data: {
        doctor,
        patientCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Doctor
export const updateDoctor = async (req, res, next) => {
  try {
    const { name, specialization, licenseNumber, phone, isActive } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Check license number uniqueness if changed
    if (licenseNumber && licenseNumber !== doctor.licenseNumber) {
      const existingLicense = await Doctor.findOne({ 
        licenseNumber, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingLicense) {
        throw new AppError('License number already registered', 400);
      }
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, specialization, licenseNumber, phone, isActive },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    logger.info(`Doctor updated: ${updatedDoctor._id} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Doctor updated successfully',
      data: { doctor: updatedDoctor },
    });
  } catch (error) {
    next(error);
  }
};

// Delete Doctor
export const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Check if doctor has assigned patients
    const patientCount = await Patient.countDocuments({ 
      assignedDoctorId: doctor._id 
    });

    if (patientCount > 0) {
      throw new AppError(
        `Cannot delete doctor with ${patientCount} assigned patient(s). Please reassign patients first.`,
        400
      );
    }

    await Doctor.findByIdAndDelete(req.params.id);

    logger.info(`Doctor deleted: ${req.params.id} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ASSIGNMENT ====================

// Assign doctor to patient
export const assignDoctorToPatient = async (req, res, next) => {
  try {
    const { patientId, doctorId } = req.body;

    if (!patientId || !doctorId) {
      throw new AppError('Patient ID and Doctor ID are required', 400);
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    if (!doctor.isActive) {
      throw new AppError('Cannot assign inactive doctor', 400);
    }

    patient.assignedDoctorId = doctorId;
    await patient.save();

    await patient.populate('assignedDoctorId', 'name specialization');

    logger.info(`Doctor ${doctorId} assigned to patient ${patientId} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Doctor assigned to patient successfully',
      data: { patient },
    });
  } catch (error) {
    next(error);
  }
};

// Get available doctors for assignment
export const getAvailableDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .populate('userId', 'name email')
      .select('name specialization licenseNumber')
      .sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      data: { doctors },
    });
  } catch (error) {
    next(error);
  }
};