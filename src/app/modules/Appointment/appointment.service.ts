import { Appointment } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../utils/prisma';
import { IPaginationOptions } from '../../types/pagination';

const createAppointment = async (payload: Appointment, user: JwtPayload) => {
	const patient = await prisma.patient.findUnique({ where: { email: user.email } });

	const doctorData = await prisma.doctor.findUniqueOrThrow({ where: { id: payload.doctorId } });

	await prisma.doctorSchedules.findFirstOrThrow({
		where: {
			doctorId: payload.doctorId,
			scheduleId: payload.scheduleId,
			isBooked: false
		}
	});

	const videoCallingId = uuidv4();
	const result = await prisma.$transaction(async (tx) => {
		const createdAppointment = await tx.appointment.create({
			data: {
				patientId: patient?.id as string,
				doctorId: payload.doctorId,
				scheduleId: payload.scheduleId,
				videoCallingId
			}
		});

		await tx.doctorSchedules.update({
			where: {
				doctorId_scheduleId: {
					doctorId: payload.doctorId,
					scheduleId: payload.scheduleId
				}
			},
			data: {
				appointmentId: createdAppointment.id,
				isBooked: true
			}
		});
		const today = new Date();
		const transactionId = `PH-HealthCare-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${Math.floor(
			Math.random() * 1000
		)}`;

		await tx.payment.create({
			data: {
				appointmentId: createdAppointment.id,
				amount: doctorData.appointmentFee,
				transactionId
			}
		});

		return createdAppointment;
	});

	return result;
};

const getMyAppointment = async (user: JwtPayload, filters: any, options: IPaginationOptions) => {
	console.log({ user, filters, options });
};

const AppointmentServices = {
	createAppointment,
	getMyAppointment
};

export default AppointmentServices;
