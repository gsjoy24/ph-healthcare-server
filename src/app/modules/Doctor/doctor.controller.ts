import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import { doctorFilterAbleFields } from './doctor.constant';
import DoctorServices from './doctor.service';

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
	const params = pick(req.query, doctorFilterAbleFields);
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const result = await DoctorServices.getAllDoctors(params, options);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Doctors fetched successfully!',
		meta: result?.meta,
		data: result?.data
	});
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await DoctorServices.getByIdFromDb(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Doctor fetched successfully!',
		data: result
	});
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const data = req.body;
	const result = await DoctorServices.updateIntoDB(id, data);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Admin updated successfully!',
		data: result
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	await DoctorServices.deleteFromDB(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Doctor deleted successfully!'
	});
});

const DoctorControllers = {
	getAllDoctors,
	getAdminById,
	updateDoctor,
	deleteFromDB
};
export default DoctorControllers;
