import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import PrescriptionServices from './prescription.service';

const createPrescription = catchAsync(async (req: Request, res: Response) => {
	const result = await PrescriptionServices.createPrescription(req.body);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Prescription created successfully!',
		data: result
	});
});

const PrescriptionControllers = {
	createPrescription
};

export default PrescriptionControllers;
