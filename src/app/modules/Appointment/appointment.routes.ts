import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import AppointmentControllers from './appointment.controller';

const router = express.Router();

router.post('/', auth(UserRole.PATIENT), AppointmentControllers.createAppointment);
router.get('/my-appointments', auth(UserRole.PATIENT, UserRole.DOCTOR), AppointmentControllers.getMyAppointment);
router.patch(
	'/status/:appointmentId',
	auth(UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN),
	AppointmentControllers.changeAppointmentStatus
);

// get route for admins
const AppointmentRoutes = router;
export default AppointmentRoutes;
