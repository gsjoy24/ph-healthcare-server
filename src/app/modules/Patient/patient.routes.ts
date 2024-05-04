import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import PatientControllers from './patient.controller';
const router = express.Router();

router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.getAllPatients);
router.get('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.getPatientById);
router.patch(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	// validateRequest(adminValidations.updateAdminSchema),
	PatientControllers.updatePatient
);
router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.deleteFromDB);
router.delete('/soft-delete:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), PatientControllers.softDeleteFromDB);

export const PatientRoutes = router;
