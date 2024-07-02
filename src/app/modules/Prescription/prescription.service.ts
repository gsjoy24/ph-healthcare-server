import { AppointmentStatus, PaymentStatus, Prescription } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import calculatePagination from '../../../utils/paginationHelper';
import prisma from '../../../utils/prisma';
import ApiError from '../../errors/ApiError';
import { TPaginationOptions } from '../../types/pagination';

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
		throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to create a prescription for this appointment');
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

const patientPrescriptions = async (user: JwtPayload, options: TPaginationOptions) => {
	const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
	const result = await prisma.prescription.findMany({
		where: {
			patient: {
				email: user.email
			}
		},
		skip,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		},
		include: {
			doctor: true
		}
	});

	const total = await prisma.prescription.count({
		where: {
			patient: {
				email: user.email
			}
		}
	});

	return {
		meta: {
			limit,
			page,
			total
		},
		data: result
	};
};

const PrescriptionServices = {
	createPrescription,
	patientPrescriptions
};

export default PrescriptionServices;
