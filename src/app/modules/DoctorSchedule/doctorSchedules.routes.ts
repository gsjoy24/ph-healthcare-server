import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import DoctorSchedulesControllers from './doctorSchedules.controller';

const router = express.Router();

router.post('/create', auth(UserRole.DOCTOR), DoctorSchedulesControllers.createDoctorSchedules);

const DoctorSchedules = router;

export default DoctorSchedules;
