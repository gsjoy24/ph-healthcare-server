import express from 'express';
import { adminRoutes } from '../modules/Admin/admin.routes';
import { authRoutes } from '../modules/Auth/auth.routes';
import { DoctorRoutes } from '../modules/Doctor/doctor.routes';
import SpecialtiesRoutes from '../modules/Specialities/specialties.routes';
import { userRoutes } from '../modules/User/user.routes';
import { PatientRoutes } from '../modules/Patient/patient.routes';

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
	}
];

moduleRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
