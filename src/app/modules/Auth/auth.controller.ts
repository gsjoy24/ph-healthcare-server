import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import AuthServices from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const { needPasswordChange, accessToken, refreshToken } = await AuthServices.loginUser(
		req.body?.email,
		req.body?.password
	);

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: false
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Login successful!',
		data: {
			needPasswordChange,
			accessToken
		}
	});
});

const createRefreshToken = catchAsync(async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;
	const token = await AuthServices.createRefreshToken(refreshToken);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Refresh token created successfully'
	});
});

const AuthControllers = {
	loginUser,
	createRefreshToken
};

export default AuthControllers;
