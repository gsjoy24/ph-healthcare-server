import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import PrescriptionServices from './prescription.service';

const createPrescription = catchAsync(async (req: Request, res: Response) => {
	const result = await PrescriptionServices.createPrescription(req.body, req.user as JwtPayload);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Prescription created successfully!',
		data: result
	});
});

const patientPrescriptions = catchAsync(async (req: Request, res: Response) => {
   
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const result = await PrescriptionServices.patientPrescriptions(req.user as JwtPayload, options);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Prescriptions fetched successfully!',
		data: result
	});
});

const PrescriptionControllers = {
	createPrescription,
	patientPrescriptions
};

export default PrescriptionControllers;
