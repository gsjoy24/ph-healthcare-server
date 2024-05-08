import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import ReviewControllers from './review.controller';

const router = express.Router();

router.post('/', auth(UserRole.PATIENT), ReviewControllers.insertReview);
// get all reviews

const reviewRoutes = router;

export default reviewRoutes;
