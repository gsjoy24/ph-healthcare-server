import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../utils/catchAsync';
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

const AppointmentControllers = {
	createAppointment
};

export default AppointmentControllers;