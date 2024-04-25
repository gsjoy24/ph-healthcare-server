import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createToken from '../../../utils/createToken';
import prisma from '../../../utils/prisma';
import config from '../../config';

const loginUser = async (email: string, password: string) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			email
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
	let decodedData;
	try {
		decodedData = jwt.verify(token, config.refreshSecret as string);
	} catch (error) {
		throw new Error('You are not authorized!');
	}
	const isUserExists = await prisma.user.findUniqueOrThrow({
		where: {
			email: decodedData?.email
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
