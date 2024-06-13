import { DoctorSchedules, Prisma, Schedule, User } from '@prisma/client';
import { addHours, addMinutes, format } from 'date-fns';
import calculatePagination from '../../../utils/paginationHelper';
import prisma from '../../../utils/prisma';
import { TPaginationOptions } from '../../types/pagination';
import { TSchedule } from './schedule.types';

const createSchedule = async (payload: TSchedule): Promise<Schedule[]> => {
	const { startDate, endDate, startTime, endTime } = payload;

	const schedules = [];

	const currentDate = new Date(startDate);
	const lastDate = new Date(endDate);

	while (currentDate <= lastDate) {
		const startDateTime = new Date(
			addMinutes(
				addHours(`${format(currentDate, 'yyyy-MM-dd')}`, Number(startTime.split(':')[0])),
				Number(startTime.split(':')[1])
			)
		);

		const endDateTime = new Date(
			addMinutes(
				addHours(`${format(currentDate, 'yyyy-MM-dd')}`, Number(endTime.split(':')[0])),
				Number(endTime.split(':')[1])
			)
		);

		while (startDateTime < endDateTime) {
			const scheduleData = {
				startDateTime,
				endDateTime: addMinutes(startDateTime, 30)
			};

			const isScheduleExist = await prisma.schedule.findFirst({
				where: {
					startDateTime: scheduleData.startDateTime,
					endDateTime: scheduleData.endDateTime
				}
			});

			if (!isScheduleExist) {
				const result = await prisma.schedule.create({
					data: scheduleData
				});
				schedules.push(result);
			}
			startDateTime.setMinutes(startDateTime.getMinutes() + 30);
		}

		currentDate.setDate(currentDate.getDate() + 1);
	}

	return schedules;
};

const getAllFromDb = async (params: any, options: TPaginationOptions, user: User) => {
	const { startDate, endDate, ...restFilterData } = params;

	const { limit, page, skip } = calculatePagination(options);
	const sortBy = options.sortBy || 'startDateTime';

	const conditions: Prisma.ScheduleWhereInput[] = [];

	if (startDate && endDate) {
		conditions.push({
			AND: [
				{
					startDateTime: {
						gte: startDate
					}
				},
				{
					endDateTime: {
						lte: endDate
					}
				}
			]
		});
	}

	if (Object.keys(restFilterData).length) {
		conditions.push({
			AND: Object.keys(restFilterData).map((key) => ({
				[key]: {
					equals: (restFilterData as any)[key]
				}
			}))
		});
	}

	const doctorSchedule = await prisma.doctorSchedules.findMany({
		where: {
			doctor: {
				email: user.email
			}
		}
	});

	const DoctorScheduleIds = doctorSchedule.map((schedule: DoctorSchedules) => schedule.scheduleId);

	const result = await prisma.schedule.findMany({
		where: {
			AND: conditions,
			id: {
				notIn: DoctorScheduleIds
			}
		},
		skip,
		take: limit,
		orderBy: {
			[sortBy]: 'asc'
		}
	});

	const total = await prisma.schedule.count({
		where: {
			AND: conditions,
			id: {
				notIn: DoctorScheduleIds
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

const getById = async (id: string) => {
	const result = await prisma.schedule.findUniqueOrThrow({
		where: {
			id
		}
	});

	return result;
};

const deleteById = async (id: string) => {
	const result = await prisma.schedule.delete({
		where: {
			id
		}
	});

	return result;
};

const ScheduleServices = {
	createSchedule,
	getAllFromDb,
	getById,
	deleteById
};

export default ScheduleServices;
