import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import MetaControllers from './meta.controller';

const router = express.Router();

router.get(
	'/',
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
	MetaControllers.getDashboardMetaData
);

const metaRoutes = router;

export default metaRoutes;
