import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import SpecialtiesServices from './specialties.service';

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
	const result = await SpecialtiesServices.createSpecialty(req);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Specialty created successfully!',
		data: result
	});
});

const getSpecialties = catchAsync(async (req: Request, res: Response) => {
	const result = await SpecialtiesServices.getSpecialties();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Specialties fetched successfully!',
		data: result
	});
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SpecialtiesServices.deleteSpecialty(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Specialty deleted successfully!',
		data: result
	});
});

const SpecialtiesController = {
	createSpecialty,
	getSpecialties,
	deleteSpecialty
};

export default SpecialtiesController;
