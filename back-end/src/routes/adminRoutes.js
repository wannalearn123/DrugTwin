import express from 'express';
import {
  // Patient routes
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  // Doctor routes
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  assignDoctorToPatient,
  getAvailableDoctors,
  // User routes
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  toggleUserStatus,
} from '../controller/adminController.js';
import { protect, restrictTo } from '../middleware/authWare.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('admin'));

// ========== USER ROUTES ==========
router.route('/user')
  .get(getAllUsers)
  .post(createUser);

router.route('/user/:id')
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

router.patch('/user/:id/toggle-status', toggleUserStatus);

// ========== PATIENT ROUTES ==========
router.route('/patient')
  .get(getPatients)
  .post(createPatient);

router.route('/patient/:id')
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

// ========== DOCTOR ROUTES ==========
router.route('/doctor')
  .get(getDoctors)
  .post(createDoctor);

router.route('/doctor/:id')
  .get(getDoctor)
  .put(updateDoctor)
  .delete(deleteDoctor);

// ========== ASSIGNMENT ROUTES ==========
router.post('/assign-doctor', assignDoctorToPatient);
router.get('/available-doctors', getAvailableDoctors);

export default router;