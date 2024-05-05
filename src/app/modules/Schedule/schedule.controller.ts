import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import ScheduleServices from './schedule.service';

const createSchedule = catchAsync(async (req: Request, res: Response) => {
	const result = await ScheduleServices.createSchedule(req.body);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Schedule created successfully',
		data: result
	});
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
	const params = pick(req.query, ['startDateTime', 'endDateTime']);
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const result = await ScheduleServices.getAllFromDb(params, options);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Schedules fetched successfully',
		data: result
	});
});

const ScheduleControllers = {
	createSchedule,
	getAllFromDb
};

export default ScheduleControllers;
