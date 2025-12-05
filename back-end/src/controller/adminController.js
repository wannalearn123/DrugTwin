import Patient from '../model/patient.js';
import Doctor from '../model/doctor.js';
import User from '../model/user.js';
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

// ==================== USER MANAGEMENT ====================

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive, search } = req.query;

    const filter = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(filter);

    // Get profile status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();
        
        if (user.role === 'patient') {
          const patient = await Patient.findOne({ userId: user._id });
          userObj.hasProfile = !!patient;
          userObj.profileId = patient?._id;
        } else if (user.role === 'doctor') {
          const doctor = await Doctor.findOne({ userId: user._id });
          userObj.hasProfile = !!doctor;
          userObj.profileId = doctor?._id;
        } else {
          userObj.hasProfile = false;
          userObj.profileId = null;
        }
        
        return userObj;
      })
    );

    res.status(200).json({
      status: 'success',
      data: {
        users: usersWithStatus,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single user
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Get associated profile
    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ userId: user._id })
        .populate('assignedDoctorId', 'name specialization');
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ userId: user._id });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new user (by admin)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      throw new AppError('Name, email, password, and role are required', 400);
    }

    // Validate role
    const validRoles = ['patient', 'doctor', 'pharmacist', 'admin'];
    if (!validRoles.includes(role)) {
      throw new AppError(`Invalid role. Must be one of: ${validRoles.join(', ')}`, 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      isActive: true,
    });

    // Remove password from response
    user.password = undefined;

    logger.info(`User created by admin: ${user.email} with role: ${user.role} by ${req.user.email}`);

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUserById = async (req, res, next) => {
  try {
    const { name, email, role, isActive, password } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password; // Will be hashed by pre-save hook

    await user.save();
    user.password = undefined;

    logger.info(`User updated: ${user.email} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent deleting admin's own account
    if (user._id.toString() === req.user._id.toString()) {
      throw new AppError('You cannot delete your own account', 403);
    }

    // Check for associated profiles
    if (user.role === 'patient') {
      const patient = await Patient.findOne({ userId: user._id });
      if (patient) {
        throw new AppError(
          'Cannot delete user with active patient profile. Delete patient profile first.',
          400
        );
      }
    } else if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) {
        const patientCount = await Patient.countDocuments({ assignedDoctorId: doctor._id });
        if (patientCount > 0) {
          throw new AppError(
            `Cannot delete doctor with ${patientCount} assigned patients. Reassign patients first.`,
            400
          );
        }
        // Delete doctor profile
        await Doctor.findByIdAndDelete(doctor._id);
      }
    }

    await User.findByIdAndDelete(req.params.id);

    logger.info(`User deleted: ${user.email} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Toggle user active status
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = !user.isActive;
    await user.save();
    user.password = undefined;

    logger.info(`User status toggled: ${user.email} is now ${user.isActive ? 'active' : 'inactive'} by admin: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};