import { Prisma, Schedule } from '@prisma/client';
import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../../utils/prisma';
import { IPaginationOptions } from '../../types/pagination';
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

const getAllFromDb = async (params: any, options: IPaginationOptions) => {
	const { startDate, endDate, ...restFilterData } = params;
	console.log({ startDate, endDate });

	const limit = options.limit ? Number(options.limit) : 10;
	const page = options.page ? (Number(options.page) - 1) * limit : 0;
	const sortBy = options.sortBy || 'startDateTime';
	const sortOrder = options.sortOrder || 'asc';

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

	const result = await prisma.schedule.findMany({
		where: { AND: conditions },
		skip: page,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		}
	});

	const total = await prisma.schedule.count({
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
const ScheduleServices = {
	createSchedule,
	getAllFromDb
};

export default ScheduleServices;
