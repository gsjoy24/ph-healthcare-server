import { User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import DoctorScheduleServices from './doctorSchedules.service';

const createDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
	const email = req.user?.email;
	const result = await DoctorScheduleServices.createDoctorSchedule(email as string, req.body);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Specialty created successfully!',
		data: result
	});
});

const getMySchedules = catchAsync(async (req: Request, res: Response) => {
	const params = pick(req.query, ['startDate', 'endDate', 'isBooked']);
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const result = await DoctorScheduleServices.getMySchedules(params, options, req.user as User);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Schedules fetched successfully',
		data: result
	});
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
	const { scheduleId } = req.params;
	const email = req.user?.email as string;
	const result = await DoctorScheduleServices.deleteSchedule(email, scheduleId);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Schedule deleted successfully',
		data: result
	});
});

const DoctorSchedulesControllers = {
	createDoctorSchedules,
	getMySchedules,
	deleteSchedule
};

export default DoctorSchedulesControllers;
