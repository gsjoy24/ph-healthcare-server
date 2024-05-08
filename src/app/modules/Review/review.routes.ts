import express from 'express';

import ReviewControllers from './review.controller';

const router = express.Router();

router.post('/', ReviewControllers.insertReview);

const reviewRoutes = router;

export default reviewRoutes;
