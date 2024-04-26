import { NextFunction, Request, Response } from 'express';
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	res.status(err?.statusCode || 500).json({
		status: false,
		message: err.message || 'Something went wrong!',
		error: err
	});
};

export default globalErrorHandler;
