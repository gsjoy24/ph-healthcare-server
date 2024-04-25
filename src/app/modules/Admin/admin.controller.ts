import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import { adminFilterAbleFields } from './admin.constant';
import AdminServices from './admin.service';

const getAllAdmins = async (req: Request, res: Response) => {
	try {
		const params = pick(req.query, adminFilterAbleFields);
		const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
		const result = await AdminServices.getAllAdmins(params, options);
		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Admins fetched successfully',
			meta: result?.meta,
			data: result?.data
		});
	} catch (error: any) {
		res.status(httpStatus.NOT_FOUND).json({
			success: false,
			message: error?.name || 'Something went wrong while fetching admins'
		});
	}
};

const getAdminById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const result = await AdminServices.getAdminByIdFromDb(id);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Admin fetched successfully',
			data: result
		});
	} catch (error: any) {
		res.status(httpStatus.NOT_FOUND).json({
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
		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Admin updated successfully',
			data: result
		});
	} catch (error: any) {
		res.status(httpStatus.NOT_FOUND).json({
			success: false,
			message: error?.name || 'Something went wrong while updating admin',
			errors: error
		});
	}
};

const deleteFromDB = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await AdminServices.deleteFromDB(id);
		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Admin deleted successfully'
		});
	} catch (error: any) {
		res.status(httpStatus.NOT_FOUND).json({
			success: false,
			message: error?.name || 'Something went wrong while deleting admin'
		});
	}
};

const AdminControllers = {
	getAllAdmins,
	getAdminById,
	updateAdmin,
	deleteFromDB
};
export default AdminControllers;
