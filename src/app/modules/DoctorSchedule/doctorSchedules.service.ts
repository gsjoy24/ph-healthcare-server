import { Doctor, DoctorSchedules, Prisma, User } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../utils/prisma';
import apiError from '../../errors/apiError';
import { IPaginationOptions } from '../../types/pagination';

const createDoctorSchedule = async (doctorEmail: string, payload: { schedules: string[] }) => {
	const doctorData = (await prisma.doctor.findUnique({ where: { email: doctorEmail } })) as Doctor;

	const scheduleData = payload.schedules.map((scheduleId) => ({ doctorId: doctorData?.id, scheduleId }));

	const result = await prisma.doctorSchedules.createMany({
		data: scheduleData
	});
	return result;
};

const getMySchedules = async (params: any, options: IPaginationOptions, user: User) => {
	const { startDate, endDate, ...restFilterData } = params;

	const limit = options.limit ? Number(options.limit) : 10;
	const page = options.page ? (Number(options.page) - 1) * limit : 0;
	const sortBy = options.sortBy || 'scheduleId';
	const sortOrder = options.sortOrder || 'asc';

	const doctor = await prisma.doctor.findUnique({ where: { email: user.email } });

	const conditions: Prisma.DoctorSchedulesWhereInput[] = [
		{
			doctorId: doctor?.id
		}
	];

	if (startDate && endDate) {
		conditions.push({
			AND: [
				{
					schedule: {
						startDateTime: {
							gte: startDate
						}
					}
				},
				{
					schedule: {
						endDateTime: {
							lte: endDate
						}
					}
				}
			]
		});
	}

	if (Object.keys(restFilterData).length > 0) {
		if (typeof restFilterData.isBooked === 'string' && restFilterData.isBooked === 'true') {
			restFilterData.isBooked = true;
		} else if (typeof restFilterData.isBooked === 'string' && restFilterData.isBooked === 'false') {
			restFilterData.isBooked = false;
		}

		conditions.push({
			AND: Object.keys(restFilterData).map((key) => {
				return {
					[key]: {
						equals: (restFilterData as any)[key]
					}
				};
			})
		});
	}

	const result = await prisma.doctorSchedules.findMany({
		where: {
			AND: conditions
		},
		skip: page,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		},
		include: {
			schedule: true
		}
	});

	const total = await prisma.doctorSchedules.count({
		where: {
			AND: conditions
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

const deleteSchedule = async (email: string, scheduleId: string) => {
	const doctorData = await prisma.doctor.findUnique({ where: { email: email } });

	const isBookedSchedule = await prisma.doctorSchedules.findFirst({
		where: {
			doctorId: doctorData?.id as string,
			scheduleId,
			isBooked: true
		}
	});

	if (isBookedSchedule) {
		throw new apiError(httpStatus.BAD_REQUEST, 'You cannot delete a booked schedule!');
	}
	const result = await prisma.doctorSchedules.delete({
		where: {
			doctorId_scheduleId: {
				doctorId: doctorData?.id as string,
				scheduleId
			}
		}
	});

	return result;
};

const DoctorScheduleServices = {
	createDoctorSchedule,
	getMySchedules,
	deleteSchedule
};

export default DoctorScheduleServices;
