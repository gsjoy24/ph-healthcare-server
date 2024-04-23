import express from 'express';
import AdminControllers from './admin.controller';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);
router.get('/:id', AdminControllers.getAdminById);

export const adminRouter = router;
