import { userStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import createToken from '../../../utils/createToken';
import emailSender from '../../../utils/emailSender';
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
			email: user.email,
			status: userStatus.ACTIVE
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
			email: userData.email,
			status: userStatus.ACTIVE
		},
		data: {
			password: hashedPassword,
			needPasswordChange: false
		}
	});

	return;
};

const forgotPassword = async (email: string) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			email,
			status: userStatus.ACTIVE
		}
	});
	const tokenData = {
		id: userData.id,
		email: userData.email,
		role: userData.role
	};
	const resetToken = createToken(tokenData, config.reset_pass_secret as string, config.reset_pass_secret_exp as string);

	const resetPassLink = config.base_app_url + `/reset-password?id=${userData.id}&token=${resetToken}`;
	console.log(resetPassLink);
	const emailTemp = `
	<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .email-container {
            background-color: #ffffff;
            max-width: 500px;
            width: 100%;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h1 {
            color: #007bff;
            font-size: 28px;
            margin-bottom: 20px;
        }

        p {
            color: #333333;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: #ffffff;
            font-size: 16px;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Password Reset</h1>
        <p>You've requested to reset your password. Click the button below to reset it:</p>
        <a class="btn" href="${resetPassLink}">Reset Password</a>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
</body>
</html>
`;
	await emailSender(email, emailTemp);
	return;
};

const resetPassword = async (id: string, token: string, password: string) => {
	const verifiedData = verifyToken(token, config.reset_pass_secret as string);

	if (verifiedData?.id !== id) {
		throw new apiError(httpStatus.UNAUTHORIZED, 'Invalid token');
	}
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			id,
			email: verifiedData?.email,
			status: userStatus.ACTIVE
		}
	});

	const hashedPassword = await bcrypt.hash(password, config.pass_salt);

	const result = await prisma.user.update({
		where: {
			id: userData.id,
			email: userData.email,
			status: userStatus.ACTIVE
		},
		data: {
			password: hashedPassword,
			needPasswordChange: false
		}
	});
	console.log(result);

	return;
};

const AuthServices = {
	loginUser,
	refreshToken,
	changePassword,
	forgotPassword,
	resetPassword
};

export default AuthServices;
