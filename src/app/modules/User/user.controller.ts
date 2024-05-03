import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import { userFilterAbleFields } from './user.constant';
import userServices from './user.service';

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

const changeStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;
	const result = await userServices.changeStatus(id, status);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User status updated successfully',
		data: result
	});
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
	const email = req.user?.email as string;
	const result = await userServices.getMyProfile(email);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User profile fetched successfully',
		data: result
	});
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
	const result = await userServices.updateProfile(req?.user?.email as string, req.body);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User profile updated successfully',
		data: result
	});
});

export const userControllers = {
	createAdmin,
	createDoctor,
	createPatient,
	getAllUsers,
	changeStatus,
	getMyProfile,
	updateProfile
};
