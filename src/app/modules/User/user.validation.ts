import { z } from 'zod';

const createAdmin = z.object({
	password: z.string(),
	admin: z.object({
		name: z.string({
			required_error: 'Name is required',
			invalid_type_error: 'Name must be a string'
		}),
		profilePhoto: z.string().optional(),
		email: z.string().email({
			message: 'Invalid email'
		}),
		phone: z.string({
			required_error: 'Phone is required'
		})
	})
});

const userValidations = {
	createAdmin
};

export default userValidations;
