import express from 'express';
import AppointmentControllers from './appointment.controller';

const router = express.Router();

router.post('/', AppointmentControllers.createAppointment);

const AppointmentRoutes = router;
export default AppointmentRoutes;
