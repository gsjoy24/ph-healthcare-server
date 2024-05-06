import { User } from '@prisma/client';
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
		message: 'Schedule created successfully!',
		data: result
	});
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
	const params = pick(req.query, ['startDate', 'endDate']);
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const result = await ScheduleServices.getAllFromDb(params, options, req.user as User);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Schedules fetched successfully!',
		data: result
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const result = await ScheduleServices.getById(req.params.id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Schedule fetched successfully!',
		data: result
	});
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
	await ScheduleServices.deleteById(req.params.id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Schedule deleted successfully!'
	});
});

const ScheduleControllers = {
	createSchedule,
	getAllFromDb,
	getById,
	deleteById
};

export default ScheduleControllers;
