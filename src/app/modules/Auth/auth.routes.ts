import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import AuthControllers from './auth.controller';
const router = express.Router();

router.post('/login', AuthControllers.loginUser);
router.post('/refresh-token', AuthControllers.refreshToken);
router.post(
	'/change-password',
	auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
	AuthControllers.changePassword
);
router.post('/forgot-password', AuthControllers.forgotPassword);
router.post('/reset-password', AuthControllers.resetPassword);

export const authRoutes = router;
