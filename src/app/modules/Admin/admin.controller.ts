import { Request, Response } from 'express';
import pick from '../../../utils/pick';
import { adminFilterAbleFields } from './admin.constant';
import AdminServices from './admin.service';

const getAllAdmins = async (req: Request, res: Response) => {
	try {
		const params = pick(req.query, adminFilterAbleFields);
		const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
		const result = await AdminServices.getAllAdmins(params, options);
		res.status(200).json({
			success: true,
			message: 'Admins fetched successfully',
			meta: result?.meta,
			data: result?.data
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error?.name || 'Something went wrong while fetching admins'
		});
	}
};

const getAdminById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const result = await AdminServices.getAdminByIdFromDb(id);
		res.status(200).json({
			success: true,
			message: 'Admin fetched successfully',
			data: result
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error?.name || 'Something went wrong while fetching admin'
		});
	}
};

const updateAdmin = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const data = req.body;
		const result = await AdminServices.updateIntoDB(id, data);
		res.status(200).json({
			success: true,
			message: 'Admin updated successfully',
			data: result
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error?.name || 'Something went wrong while updating admin',
			errors: error
		});
	}
};

const AdminControllers = {
	getAllAdmins,
	getAdminById,
	updateAdmin
};
export default AdminControllers;
