import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import DoctorScheduleServices from './doctorSchedules.service';

const createDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
	const id = req.user?.id;
	const result = await DoctorScheduleServices.createDoctorSchedule(id as string, req.body);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Specialty created successfully!',
		data: result
	});
});

const DoctorSchedulesControllers = {
	createDoctorSchedules
};

export default DoctorSchedulesControllers;
