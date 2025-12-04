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
} from '../controller/adminController.js';
import { protect, restrictTo } from '../middleware/authWare.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('admin'));

// Patient routes
router.route('/patient')
  .get(getPatients)
  .post(createPatient);

router.route('/patient/:id')
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

// Doctor routes
router.route('/doctor')
  .get(getDoctors)
  .post(createDoctor);

router.route('/doctor/:id')
  .get(getDoctor)
  .put(updateDoctor)
  .delete(deleteDoctor);

// Assignment routes
router.post('/assign-doctor', assignDoctorToPatient);
router.get('/available-doctors', getAvailableDoctors);

export default router;