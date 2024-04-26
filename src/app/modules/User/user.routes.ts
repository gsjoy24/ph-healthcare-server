import { userRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { userControllers } from './user.controller';

const router = express.Router();

router.post('/', auth(userRole.SUPER_ADMIN, userRole.ADMIN), userControllers.createAdmin);

export const userRoutes = router;
