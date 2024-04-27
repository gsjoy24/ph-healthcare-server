import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import AdminControllers from './admin.controller';
import adminValidations from './admin.validations';

const router = express.Router();

router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.getAllAdmins);
router.get('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.getAdminById);
router.patch(
	'/:id',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	validateRequest(adminValidations.updateAdminSchema),
	AdminControllers.updateAdmin
);
router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.deleteFromDB);

export const adminRoutes = router;
