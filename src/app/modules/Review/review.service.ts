import { Review } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

const insertReview = async (review: Review, user: JwtPayload) => {
	console.log('insertReview', review, user);
};

const ReviewServices = {
	insertReview
};

export default ReviewServices;
