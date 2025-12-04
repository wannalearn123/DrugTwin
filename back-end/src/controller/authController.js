import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import config from '../config/env.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.security.jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Register new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, licenseNumber, specialization, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new AppError('Email already registered', 409);
    } 

    // Validate role-specific requirements
    if ((role === 'doctor' || role === 'pharmacist') && !licenseNumber) {
      throw new AppError(`License number is required for ${role}`, 400);
    }

    if (role === 'doctor' && !specialization) {
      throw new AppError('Specialization is required for doctors', 400);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      licenseNumber,
      specialization,
      phoneNumber,
    });

    // Generate token
    const token = generateToken(user._id);

    logger.info(`New user registered: ${email} with role: ${user.role}`);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 401);
    }

    const token = generateToken(user._id);

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in: ${email}`);

    // Make sure response structure matches frontend expectation
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};