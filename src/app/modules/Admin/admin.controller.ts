import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import { adminFilterAbleFields } from './admin.constant';
import AdminServices from './admin.service';

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
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
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await AdminServices.getAdminByIdFromDb(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Admin fetched successfully',
		data: result
	});
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const data = req.body;
	const result = await AdminServices.updateIntoDB(id, data);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Admin updated successfully',
		data: result
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	await AdminServices.deleteFromDB(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Admin deleted successfully'
	});
});

const AdminControllers = {
	getAllAdmins,
	getAdminById,
	updateAdmin,
	deleteFromDB
};
export default AdminControllers;
