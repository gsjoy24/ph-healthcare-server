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

const ScheduleControllers = {
	createSchedule
};

export default ScheduleControllers;