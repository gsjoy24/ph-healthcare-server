import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
			status: false,
			message: err.name || 'Something went wrong!',
			error: err
		});
	}
	next();
};

export default globalErrorHandler;
