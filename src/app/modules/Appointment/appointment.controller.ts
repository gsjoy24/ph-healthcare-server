import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import AppointmentServices from './appointment.service';

const createAppointment = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await AppointmentServices.createAppointment(payload, req.user as JwtPayload);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Appointment created successfully!',
		data: result
	});
});

const getMyAppointment = catchAsync(async (req: Request, res: Response) => {
	const filters = pick(req.query, ['status', 'paymentStatus']);
	const options = pick(req.query, ['limit', 'page', 'sortby', 'sortOrder']);
	const result = await AppointmentServices.getMyAppointment(req.user as JwtPayload, filters, options);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'My appointments fetched successfully!',
		data: result
	});
});

const AppointmentControllers = {
	createAppointment,
	getMyAppointment
};

export default AppointmentControllers;
