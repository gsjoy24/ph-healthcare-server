import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import DoctorControllers from './doctor.controller';

const router = express.Router();

router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), DoctorControllers.getAllDoctors);
router.get('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), DoctorControllers.getAdminById);
router.patch(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	// validateRequest(adminValidations.updateAdminSchema),
	DoctorControllers.updateDoctor
);
router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), DoctorControllers.deleteFromDB);

export const DoctorRoutes = router;
