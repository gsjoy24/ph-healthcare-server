import { userRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import AdminControllers from './admin.controller';
import adminValidations from './admin.validations';

const router = express.Router();

router.get('/', auth(userRole.SUPER_ADMIN, userRole.ADMIN), AdminControllers.getAllAdmins);
router.get('/:id', auth(userRole.SUPER_ADMIN, userRole.ADMIN), AdminControllers.getAdminById);
router.patch(
	'/:id',
	auth(userRole.SUPER_ADMIN, userRole.ADMIN),
	validateRequest(adminValidations.updateAdminSchema),
	AdminControllers.updateAdmin
);
router.delete('/:id', auth(userRole.SUPER_ADMIN, userRole.ADMIN), AdminControllers.deleteFromDB);

export const adminRoutes = router;
