import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import { userFilterAbleFields } from './user.constant';
import { userServices } from './user.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
	const result = await userServices.createAdmin(req);
	res.status(201).json({
		success: true,
		message: 'Admin created successfully',
		data: result
	});
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
	const result = await userServices.createDoctor(req);
	res.status(201).json({
		success: true,
		message: 'Doctor created successfully',
		data: result
	});
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
	const result = await userServices.createPatient(req);
	res.status(201).json({
		success: true,
		message: 'Patient created successfully',
		data: result
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const params = pick(req.query, userFilterAbleFields);
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const result = await userServices.getAllUsers(params, options);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Users fetched successfully',
		meta: result?.meta,
		data: result?.data
	});
});

export const userControllers = {
	createAdmin,
	createDoctor,
	createPatient,
	getAllUsers
};
