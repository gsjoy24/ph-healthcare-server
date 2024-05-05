import { Doctor, DoctorSchedules, Prisma, User } from '@prisma/client';
import prisma from '../../../utils/prisma';
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

const DoctorScheduleServices = {
	createDoctorSchedule,
	getMySchedules
};

export default DoctorScheduleServices;
