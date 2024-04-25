import { Request, Response } from 'express';
import { userServices } from './user.service';

const createAdmin = async (req: Request, res: Response) => {
	try {
		const data = req.body;
		const result = await userServices.createAdmin(data);
		res.status(201).json({
			success: true,
			message: 'Admin created successfully',
			data: result
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error?.name || 'Something went wrong while creating admin',
			errors: error
		});
	}
};

export const userControllers = {
	createAdmin
};
