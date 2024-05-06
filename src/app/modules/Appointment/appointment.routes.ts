import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import AppointmentControllers from './appointment.controller';

const router = express.Router();

router.post('/', auth(UserRole.PATIENT), AppointmentControllers.createAppointment);

const AppointmentRoutes = router;
export default AppointmentRoutes;
