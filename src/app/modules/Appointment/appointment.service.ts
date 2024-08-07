import { Appointment, AppointmentStatus, PaymentStatus, Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import calculatePagination from '../../../utils/paginationHelper';
import prisma from '../../../utils/prisma';
import ApiError from '../../errors/ApiError';
import { TPaginationOptions } from '../../types/pagination';

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

const getMyAppointment = async (user: JwtPayload, filters: any, options: TPaginationOptions) => {
	const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
	const conditions: Prisma.AppointmentWhereInput[] = [];

	if (user.role === UserRole.PATIENT) {
		conditions.push({
			patient: {
				email: user.email
			}
		});
	} else if (user.role === UserRole.DOCTOR) {
		conditions.push({
			doctor: {
				email: user.email
			}
		});
	}

	if (Object.keys(filters).length) {
		conditions.push({
			AND: Object.keys(filters).map((key) => ({
				[key]: {
					equals: (filters as any)[key]
				}
			}))
		});
	}

	const result = await prisma.appointment.findMany({
		where: { AND: conditions },
		skip,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		},
		include:
			user.role === UserRole.PATIENT
				? { doctor: true, schedule: true }
				: {
						patient: {
							include: {
								medicalReport: true,
								patientHealthData: true
							}
						},
						schedule: true
				  }
	});

	const total = await prisma.appointment.count({
		where: { AND: conditions }
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

const changeAppointmentStatus = async (appointmentId: string, status: AppointmentStatus, user: JwtPayload) => {
	const appointmentData = await prisma.appointment.findUniqueOrThrow({
		where: { id: appointmentId },
		include: {
			doctor: true
		}
	});
	if (user.role === UserRole.DOCTOR) {
		if (appointmentData.doctor.email !== user.email) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to change this appointment status!');
		}
	}
	const result = await prisma.appointment.update({
		where: { id: appointmentId },
		data: {
			status
		}
	});

	return result;
};

const cancelUnpaidAppointments = async () => {
	const thirtyMinutesAgo = new Date(Date.now() - 30 * 60000);

	const unpaidAppointments = await prisma.appointment.findMany({
		where: {
			paymentStatus: PaymentStatus.UNPAID,
			createdAt: {
				lt: thirtyMinutesAgo
			}
		}
	});

	const appointmentIds = unpaidAppointments.map((appointment) => appointment.id);

	await prisma.$transaction(async (tx) => {
		await tx.payment.deleteMany({
			where: {
				appointmentId: {
					in: appointmentIds
				}
			}
		});

		await tx.appointment.deleteMany({
			where: {
				id: {
					in: appointmentIds
				}
			}
		});

		for (const appointment of unpaidAppointments) {
			await tx.doctorSchedules.updateMany({
				where: {
					doctorId: appointment.doctorId,
					scheduleId: appointment.scheduleId
				},
				data: {
					isBooked: false
				}
			});
		}
	});
};

const AppointmentServices = {
	createAppointment,
	getMyAppointment,
	changeAppointmentStatus,
	cancelUnpaidAppointments
};

export default AppointmentServices;
