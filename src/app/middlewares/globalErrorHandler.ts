import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
		status: false,
		message: err.name || 'Something went wrong!',
		error: err
	});
};

export default globalErrorHandler;
