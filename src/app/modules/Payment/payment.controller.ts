import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import PaymentServices from './payment.service';

const initPayment = catchAsync(async (req: Request, res: Response) => {
	const result = await PaymentServices.initPayment();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Payment initiated successfully!',
		data: result
	});
});

const PaymentControllers = {
	initPayment
};

export default PaymentControllers;
