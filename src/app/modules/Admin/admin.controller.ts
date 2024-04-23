import { Request, Response } from 'express';
import AdminServices from './admin.service';

const getAllAdmins = async (req: Request, res: Response) => {
	const admins = await AdminServices.getAllAdmins(req.query);
	res.send(admins);
};

const AdminControllers = {
	getAllAdmins
};
export default AdminControllers;
