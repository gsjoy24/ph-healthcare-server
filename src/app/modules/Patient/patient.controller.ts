import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import { patientFilterAbleFields } from './patient.constant';
import PatientServices from './patient.service';

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
	const params = pick(req.query, patientFilterAbleFields);
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const result = await PatientServices.getAllPatients(params, options);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Patients fetched successfully',
		meta: result?.meta,
		data: result?.data
	});
});

const getPatientById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await PatientServices.getByIdFromDb(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Patient fetched successfully',
		data: result
	});
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const data = req.body;
	const result = await PatientServices.updateIntoDB(id, data);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Patient updated successfully',
		data: result
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	await PatientServices.deleteFromDB(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Patient deleted successfully'
	});
});

const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	await PatientServices.softDeleteFromDB(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Patient softly deleted successfully'
	});
});

const PatientControllers = {
	getAllPatients,
	getPatientById,
	updatePatient,
	deleteFromDB,
	softDeleteFromDB
};

export default PatientControllers;
