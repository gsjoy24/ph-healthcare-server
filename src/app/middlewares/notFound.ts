import { Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response) => {
	res.status(httpStatus.NOT_FOUND).json({
		success: false,
		message: 'API not found!',
		error: {
			path: req.originalUrl,
			message: 'You are trying to access an API that does not exist!'
		}
	});
};

export default notFound;
