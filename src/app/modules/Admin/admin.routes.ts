import express from 'express';
import AdminControllers from './admin.controller';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);

export const adminRouter = router;