import express from 'express';
import { userControllers } from './user.controller';

const router = express.Router();

router.post('/', userControllers.createAdmin);

export const userRouter = router;
