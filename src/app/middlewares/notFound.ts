import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
	res.status(httpStatus.NOT_FOUND).send({
		status: false,
		message: 'API not found!',
		error: {
			path: req.originalUrl,
			message: 'You are trying to access an API that does not exist!'
		}
	});
};

export default notFound;
