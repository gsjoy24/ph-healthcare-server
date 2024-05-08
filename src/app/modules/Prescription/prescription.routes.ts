import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import PrescriptionControllers from './prescription.controller';

const router = express.Router();

router.post('/', auth(UserRole.DOCTOR), PrescriptionControllers.createPrescription);
router.get('/my-prescriptions', auth(UserRole.DOCTOR, UserRole.PATIENT), PrescriptionControllers.patientPrescriptions);

const PrescriptionRoutes = router;

export default PrescriptionRoutes;
