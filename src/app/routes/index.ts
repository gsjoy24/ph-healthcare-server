import express from 'express';
import { adminRoutes } from '../modules/Admin/admin.routes';
import AppointmentRoutes from '../modules/Appointment/appointment.routes';
import { authRoutes } from '../modules/Auth/auth.routes';
import { DoctorRoutes } from '../modules/Doctor/doctor.routes';
import DoctorSchedules from '../modules/DoctorSchedule/doctorSchedules.routes';
import { PatientRoutes } from '../modules/Patient/patient.routes';
import PaymentRoutes from '../modules/Payment/payment.routes';
import PrescriptionRoutes from '../modules/Prescription/prescription.routes';
import reviewRoutes from '../modules/Review/review.routes';
import { ScheduleRoutes } from '../modules/Schedule/schedule.routes';
import SpecialtiesRoutes from '../modules/Specialities/specialties.routes';
import { userRoutes } from '../modules/User/user.routes';

const router = express.Router();

const moduleRoutes = [
	{
		path: '/users',
		route: userRoutes
	},
	{
		path: '/admins',
		route: adminRoutes
	},
	{
		path: '/doctors',
		route: DoctorRoutes
	},
	{
		path: '/patients',
		route: PatientRoutes
	},
	{
		path: '/auth',
		route: authRoutes
	},
	{
		path: '/specialties',
		route: SpecialtiesRoutes
	},
	{
		path: '/schedules',
		route: ScheduleRoutes
	},
	{
		path: '/doctor-schedules',
		route: DoctorSchedules
	},
	{
		path: '/appointments',
		route: AppointmentRoutes
	},
	{
		path: '/payments',
		route: PaymentRoutes
	},
	{
		path: '/prescriptions',
		route: PrescriptionRoutes
	},
	{
		path: '/reviews',
		route: reviewRoutes
	}
];

moduleRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
