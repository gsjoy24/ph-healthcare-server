import express, { Request, Response } from 'express';
import { userControllers } from './user.controller';

const router = express.Router();

router.get('/', userControllers.createAdmin);

export const userRouter = router;
