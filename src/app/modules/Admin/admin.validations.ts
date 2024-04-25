import { z } from 'zod';

const updateAdminSchema = z.object({
	body: z.object({
		name: z
			.string({
				invalid_type_error: 'Name must be a string'
			})
			.min(2, {
				message: 'Name must be at least 2 characters long'
			})
			.max(50, {
				message: 'Name must be at most 50 characters long'
			})
			.optional(),
		email: z
			.string()
			.email({
				message: 'Invalid email address'
			})
			.optional(),
		phone: z
			.string({
				message: 'Phone number must be a string'
			})
			.optional(),
		profilePhoto: z
			.string({
				message: 'Profile photo must be a string'
			})
			.optional(),
		isDeleted: z
			.boolean({
				message: 'isDeleted must be true or false'
			})
			.optional()
	})
});

const adminValidations = {
	updateAdminSchema
};

export default adminValidations;
