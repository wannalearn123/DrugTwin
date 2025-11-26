import express from 'express';
import {
  createPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
  createDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  assignDoctor,
} from '../controller/adminController.js';
import { protect, restrictTo } from '../middleware/authWare.js';
import { checkPermission } from '../middleware/RBACWare.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// ============ PATIENT ROUTES ============
router.route('/patient')
  .post(checkPermission(['patient:write']), createPatient)
  .get(checkPermission(['patient:read']), getAllPatients);

router.route('/patient/:id')
  .get(checkPermission(['patient:read']), getPatient)
  .put(checkPermission(['patient:write']), updatePatient)
  .delete(checkPermission(['patient:delete']), deletePatient);

// ============ DOCTOR ROUTES ============
router.route('/doctor')
  .post(checkPermission(['doctor:write']), createDoctor)
  .get(checkPermission(['doctor:read']), getAllDoctors);

router.route('/doctor/:id')
  .get(checkPermission(['doctor:read']), getDoctor)
  .put(checkPermission(['doctor:write']), updateDoctor)
  .delete(checkPermission(['doctor:delete']), deleteDoctor);

// ============ ASSIGNMENT ROUTE ============
router.post('/assign-doctor', checkPermission(['assignment:write']), assignDoctor);

export default router;