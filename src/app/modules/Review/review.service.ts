import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../utils/prisma';
import ApiError from '../../errors/ApiError';

const insertReview = async (payload: any, user: JwtPayload) => {
	const patientData = await prisma.patient.findUniqueOrThrow({
		where: {
			email: user.email
		}
	});

	const appointmentData = await prisma.appointment.findUniqueOrThrow({
		where: {
			id: payload.appointmentId
		}
	});

	if (appointmentData.patientId !== patientData.id) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to perform this action');
	}

	const result = await prisma.$transaction(async (tx) => {
		const reviewData = await tx.review.create({
			data: {
				rating: payload.rating,
				comment: payload.comment,
				doctorId: appointmentData.doctorId,
				patientId: appointmentData.patientId,
				appointmentId: payload.appointmentId
			}
		});

		const avgRating = await tx.review.aggregate({
			_avg: {
				rating: true
			},
			where: {
				doctorId: appointmentData.doctorId
			}
		});

		await tx.doctor.update({
			where: {
				id: appointmentData.doctorId
			},
			data: {
				avgRating: avgRating._avg.rating as number
			}
		});

		return reviewData;
	});

	return result;
};

const ReviewServices = {
	insertReview
};

export default ReviewServices;
