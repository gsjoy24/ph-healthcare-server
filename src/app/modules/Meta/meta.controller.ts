import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import MetaServices from './meta.service';

const getDashboardMetaData = catchAsync(async (req: Request, res: Response) => {
	const result = await MetaServices.getDashboardMetaData(req.user as JwtPayload);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Meta fetched successfully!',
		data: result
	});
});

const MetaControllers = {
	getDashboardMetaData
};

export default MetaControllers;
