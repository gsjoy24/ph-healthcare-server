import { userRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import AuthControllers from './auth.controller';
const router = express.Router();

router.post('/login', AuthControllers.loginUser);
router.post('/refresh-token', AuthControllers.refreshToken);
router.post(
	'/change-password',
	auth(userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT, userRole.SUPER_ADMIN),
	AuthControllers.changePassword
);
router.post('/forgot-password', AuthControllers.forgotPassword);
export const authRoutes = router;
