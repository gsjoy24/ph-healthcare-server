import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	let message = err.message || 'Something went wrong!';
	if (err instanceof Prisma.PrismaClientValidationError) {
		message = 'Invalid input data!';
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === 'P2002') {
			message = 'Duplicate record found!';
		}
	}

	res.status(err?.statusCode || 500).json({
		status: false,
		message,
		error: err
	});
};

export default globalErrorHandler;
