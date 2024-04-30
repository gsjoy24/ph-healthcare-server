import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
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

export const userControllers = {
	createAdmin,
	createDoctor,
	createPatient
};
