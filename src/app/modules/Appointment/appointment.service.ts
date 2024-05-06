import { Appointment } from '@prisma/client';

const createAppointment = async (payload: Appointment) => {
	console.log({ payload });
};

const AppointmentServices = {
	createAppointment
};

export default AppointmentServices;
