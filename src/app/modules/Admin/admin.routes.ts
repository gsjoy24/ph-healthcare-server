import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import AdminControllers from './admin.controller';
import adminValidations from './admin.validations';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);
router.get('/:id', AdminControllers.getAdminById);
router.patch('/:id', validateRequest(adminValidations.updateAdminSchema), AdminControllers.updateAdmin);
router.delete('/:id', AdminControllers.deleteFromDB);

export const adminRoutes = router;
