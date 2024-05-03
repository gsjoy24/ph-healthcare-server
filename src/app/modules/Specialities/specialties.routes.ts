import { UserRole } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import fileUploader from '../../../utils/fileUploader';
import auth from '../../middlewares/auth';
import SpecialtiesController from './specialties.controller';
import specialtiesValidations from './specialties.validation';
const router = express.Router();

router.post(
	'/',
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
	fileUploader.upload.single('file'),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = specialtiesValidations.createSpecialty.parse(JSON.parse(req.body.data));
		SpecialtiesController.createSpecialty(req, res, next);
	}
);

router.get('/', SpecialtiesController.getSpecialties);

router.delete('/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), SpecialtiesController.deleteSpecialty);

const SpecialtiesRoutes = router;

export default SpecialtiesRoutes;
