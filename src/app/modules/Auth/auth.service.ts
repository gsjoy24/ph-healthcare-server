import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

	const accessToken = jwt.sign(
		{
			id: userData.id,
			email: userData.email,
			role: userData.role
		},
		'hoidhfoishuuh',
		{
			expiresIn: '1d',
			algorithm: 'HS256'
		}
	);

	const refreshToken = jwt.sign(
		{
			id: userData.id,
			email: userData.email,
			role: userData.role
		},
		'hoidhfoishuuh',
		{
			expiresIn: '30d',
			algorithm: 'HS256'
		}
	);

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
