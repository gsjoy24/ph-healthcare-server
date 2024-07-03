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

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	const OldRefreshToken = req.cookies.refreshToken;
	const { accessToken, needPasswordChange } = await AuthServices.refreshToken(OldRefreshToken);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Access token refreshed successfully!',
		data: {
			accessToken,
			needPasswordChange
		}
	});
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
	await AuthServices.changePassword(req?.user, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Password changed successfully!'
	});
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	await AuthServices.forgotPassword(req.body?.email);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Password reset link sent to your email'
	});
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { id, password } = req.body;
	const token = req.headers?.authorization || '';
	await AuthServices.resetPassword(id, token, password);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Password reset successfully!'
	});
});
const AuthControllers = {
	loginUser,
	refreshToken,
	changePassword,
	forgotPassword,
	resetPassword
};

export default AuthControllers;
