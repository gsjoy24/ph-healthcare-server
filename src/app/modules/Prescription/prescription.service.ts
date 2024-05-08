import { AppointmentStatus, PaymentStatus, Prescription } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../utils/prisma';
import apiError from '../../errors/apiError';

const createPrescription = async (payload: Prescription, user: JwtPayload) => {
	const appointmentData = await prisma.appointment.findUniqueOrThrow({
		where: {
			id: payload.appointmentId,
			status: AppointmentStatus.COMPLETED,
			paymentStatus: PaymentStatus.PAID
		},
		include: {
			doctor: true
		}
	});

	if (appointmentData.doctor.email !== user.email) {
		throw new apiError(httpStatus.UNAUTHORIZED, 'You are not authorized to create a prescription for this appointment');
	}

	const result = await prisma.prescription.create({
		data: {
			appointmentId: payload.appointmentId,
			doctorId: appointmentData.doctorId,
			patientId: appointmentData.patientId,
			instructions: payload.instructions,
			followUpDate: payload.followUpDate || null
		},
		include: {
			patient: true
		}
	});

	return result;
};

const PrescriptionServices = {
	createPrescription
};

export default PrescriptionServices;
