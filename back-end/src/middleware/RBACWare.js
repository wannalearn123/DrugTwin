import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import config from '../config/env.js';

// Check if user has required permissions based on scopes
export const checkPermission = (requiredScopes = []) => {
  return (req, res, next) => {
    try {
      // User should already be authenticated by protect middleware
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      // Define role-based scopes
      const roleScopes = {
        admin: [
          'patient:read',
          'patient:write',
          'patient:delete',
          'doctor:read',
          'doctor:write',
          'doctor:delete',
          'pharmacist:read',
          'pharmacist:write',
          'assignment:write',
        ],
        doctor: [
          'patient:read',
          'prescription:write',
          'diagnosis:write',
        ],
        pharmacist: [
          'prescription:read',
          'prescription:fulfill',
          'medication:manage',
        ],
        patient: [
          'prescription:read',
          'appointment:write',
          'profile:read',
        ],
      };

      // Get user's scopes based on role
      const userScopes = roleScopes[req.user.role] || [];

      // Check if user has all required scopes
      const hasPermission = requiredScopes.every(scope => 
        userScopes.includes(scope)
      );

      if (!hasPermission) {
        throw new AppError(
          `Access denied. Required permissions: ${requiredScopes.join(', ')}`,
          403
        );
      }

      // Attach user scopes to request for further use
      req.userScopes = userScopes;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Verify and decode JWT token with scopes
export const verifyTokenScopes = (token) => {
  try {
    const decoded = jwt.verify(token, config.security.jwtSecret);
    return {
      userId: decoded.id,
      role: decoded.role,
      scopes: decoded.scopes || [],
    };
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
};