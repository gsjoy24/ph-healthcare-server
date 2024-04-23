import { Request, Response } from 'express';
import pick from '../../../utils/pick';
import { adminFilterAbleFields } from './admin.constant';
import AdminServices from './admin.service';

const getAllAdmins = async (req: Request, res: Response) => {
	const params = pick(req.query, adminFilterAbleFields);
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const admins = await AdminServices.getAllAdmins(params, options);
	res.send(admins);
};

const AdminControllers = {
	getAllAdmins
};
export default AdminControllers;
