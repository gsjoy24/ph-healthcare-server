import bcrypt from 'bcrypt';

import createToken from '../../../utils/createToken';
import prisma from '../../../utils/prisma';
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
	const accessToken = createToken(jwtData, 'hoidhfoishuuh', '1d');
	const refreshToken = createToken(jwtData, 'hoidhfoishsduuh', '30d');

	return {
		needPasswordChange: userData.needPasswordChange,
		accessToken,
		refreshToken
	};
};

const AuthServices = {
	loginUser
};

export default AuthServices;
