import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import verifyToken from '../../utils/verifyToken';
import config from '../config';
import apiError from '../errors/apiError';

const auth =
	(...roles: string[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization;
			if (!token) {
				throw new apiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
			}
			const verifiedToken = verifyToken(token, config.accessSecret as string);

			if (roles.length && !roles.includes(verifiedToken.role)) {
				throw new apiError(httpStatus.FORBIDDEN, 'You are not authorized!');
			}
			next();
		} catch (error) {
			next(error);
		}
	};

export default auth;
