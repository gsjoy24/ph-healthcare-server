import { userStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import createToken from '../../../utils/createToken';
import prisma from '../../../utils/prisma';
import verifyToken from '../../../utils/verifyToken';
import config from '../../config';

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

const AuthServices = {
	loginUser,
	refreshToken
};

export default AuthServices;
