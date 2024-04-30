import { UserRole } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import fileUploader from '../../../utils/fileUploader';
import auth from '../../middlewares/auth';
import { userControllers } from './user.controller';
import userValidations from './user.validation';

const router = express.Router();

router.post(
	'/create-admin',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	fileUploader.upload.single('file'),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = userValidations.createAdmin.parse(JSON.parse(req.body.data));
		userControllers.createAdmin(req, res, next);
	}
);

router.post(
	'/create-doctor',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	fileUploader.upload.single('file'),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = userValidations.createDoctor.parse(JSON.parse(req.body.data));
		userControllers.createDoctor(req, res, next);
	}
);

router.post(
	'/create-patient',
	fileUploader.upload.single('file'),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = userValidations.createPatient.parse(JSON.parse(req.body.data));
		userControllers.createPatient(req, res, next);
	}
);

export const userRoutes = router;
