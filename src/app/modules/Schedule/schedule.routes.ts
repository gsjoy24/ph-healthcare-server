import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import ScheduleControllers from './schedule.controller';

const router = express.Router();

router.post('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleControllers.createSchedule);

router.get('/', auth(UserRole.DOCTOR), ScheduleControllers.getAllFromDb);

router.get('/:id', auth(UserRole.DOCTOR), ScheduleControllers.getById);

router.delete('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleControllers.deleteById);

export const ScheduleRoutes = router;
