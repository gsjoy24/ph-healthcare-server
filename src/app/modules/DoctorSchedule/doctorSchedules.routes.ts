import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import DoctorSchedulesControllers from './doctorSchedules.controller';

const router = express.Router();

router.post('/', auth(UserRole.DOCTOR), DoctorSchedulesControllers.createDoctorSchedules);
router.get('/my-schedule', auth(UserRole.DOCTOR), DoctorSchedulesControllers.getMySchedules);
router.delete('/:scheduleId', auth(UserRole.DOCTOR), DoctorSchedulesControllers.deleteSchedule);

const DoctorSchedules = router;

export default DoctorSchedules;
