import { Schedule } from '@prisma/client';
import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../../utils/prisma';
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
const getAllFromDb = async () => {
	const schedules = await prisma.schedule.findMany();
	return schedules;
};
const ScheduleServices = {
	createSchedule,
	getAllFromDb
};

export default ScheduleServices;
