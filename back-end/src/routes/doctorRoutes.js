import express from 'express';
import {
  getMyPatients,
  getPatientDetails,
  createCheckup,
  getCheckupHistory,
} from '../controller/doctorController.js';
import { protect, restrictTo } from '../middleware/authWare.js';

const router = express.Router();

// All routes require authentication and doctor role
router.use(protect);
router.use(restrictTo('doctor'));

// Doctor routes
router.get('/my-patients', getMyPatients);
router.get('/patients/:patientId', getPatientDetails);
router.post('/checkup', createCheckup);
router.get('/checkups/:patientId', getCheckupHistory);

export default router;