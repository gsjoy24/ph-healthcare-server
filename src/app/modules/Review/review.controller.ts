import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import ReviewServices from './review.service';

const insertReview = catchAsync(async (req: Request, res: Response) => {
	const review = req.body;
	const user = req.user;
	const result = await ReviewServices.insertReview(review, user as JwtPayload);
	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Review created successfully!',
		data: result
	});
});

const ReviewControllers = {
	insertReview
};

export default ReviewControllers;
