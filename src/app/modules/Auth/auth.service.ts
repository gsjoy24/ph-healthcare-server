import { userStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import createToken from '../../../utils/createToken';
import prisma from '../../../utils/prisma';
import verifyToken from '../../../utils/verifyToken';
import config from '../../config';
import apiError from '../../errors/apiError';

const loginUser = async (email: string, password: string) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			email,
			status: userStatus.ACTIVE
		}
	});

	const isPasswordValid = await bcrypt.compare(password, userData.password);
	if (!isPasswordValid) {
		throw new Error('Invalid email or password');
	}
	const jwtData = {
		id: userData.id,
		email: userData.email,
		role: userData.role
	};
	const accessToken = createToken(jwtData, config.accessSecret as string, config.accessSecretExp as string);
	const refreshToken = createToken(jwtData, config.refreshSecret as string, config.refreshSecretExp as string);

	return {
		needPasswordChange: userData.needPasswordChange,
		accessToken,
		refreshToken
	};
};

const refreshToken = async (token: string) => {
	const decodedData = verifyToken(token, config.refreshSecret as string);

	const isUserExists = await prisma.user.findUniqueOrThrow({
		where: {
			email: decodedData?.email,
			status: userStatus.ACTIVE
		}
	});

	const jwtData = {
		id: isUserExists.id,
		email: isUserExists.email,
		role: isUserExists.role
	};
	const accessToken = createToken(jwtData, config.accessSecret as string, config.accessSecretExp as string);
	const refreshToken = createToken(jwtData, config.refreshSecret as string, config.refreshSecretExp as string);

	return {
		accessToken,
		refreshToken,
		needPasswordChange: isUserExists.needPasswordChange
	};
};

const changePassword = async (user: any, payload: any) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			id: user.id,
			email: user.email
		}
	});
	const isPasswordValid = await bcrypt.compare(payload.oldPassword, userData.password);

	if (!isPasswordValid) {
		throw new apiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
	}

	const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config.pass_salt));

	await prisma.user.update({
		where: {
			id: userData.id,
			email: userData.email
		},
		data: {
			password: hashedPassword,
			needPasswordChange: false
		}
	});

	return;
};

const AuthServices = {
	loginUser,
	refreshToken,
	changePassword
};

export default AuthServices;
