import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../utils/prisma';
import verifyToken from '../../utils/verifyToken';
import config from '../config';
import ApiError from '../errors/ApiError';

const auth =
	(...roles: string[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization;

			if (!token) {
				throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
			}

			const verifiedUser = verifyToken(token, config.accessSecret as string);

			if (verifiedUser.role === UserRole.ADMIN || verifiedUser.role === UserRole.SUPER_ADMIN) {
				await prisma.admin.findUniqueOrThrow({ where: { email: verifiedUser.email } });
			} else if (verifiedUser.role === UserRole.DOCTOR) {
				await prisma.doctor.findUniqueOrThrow({ where: { email: verifiedUser.email } });
			} else if (verifiedUser.role === UserRole.PATIENT) {
				await prisma.patient.findUniqueOrThrow({ where: { email: verifiedUser.email } });
			} else {
				throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
			}

			if (roles.length && !roles.includes(verifiedUser.role)) {
				throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized!');
			}
			req.user = verifiedUser as JwtPayload;
			next();
		} catch (error) {
			next(error);
		}
	};

export default auth;
