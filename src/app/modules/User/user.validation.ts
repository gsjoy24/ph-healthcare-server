import { Gender, UserStatus } from '@prisma/client';
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

const createDoctor = z.object({
	password: z.string(),
	doctor: z.object({
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
		}),
		address: z.string({
			required_error: 'Address is required'
		}),
		registrationNumber: z.string({
			required_error: 'Registration number is required'
		}),
		experience: z
			.number({
				invalid_type_error: 'Experience must be a number'
			})
			.optional(),
		gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
			message: 'Gender must be male, female or other'
		}),
		appointmentFee: z.number({
			required_error: 'Appointment fee is required',
			invalid_type_error: 'Appointment fee must be a number'
		}),
		qualifications: z.string({
			required_error: 'Qualifications are required'
		}),
		currentWorkplace: z.string({
			required_error: 'Current workplace is required'
		}),
		designation: z.string({
			required_error: 'Designation is required'
		})
	})
});

const createPatient = z.object({
	password: z.string(),
	patient: z.object(
		{
			name: z.string({
				required_error: 'Name is required',
				invalid_type_error: 'Name must be a string'
			}),
			email: z.string().email({
				message: 'Invalid email'
			}),
			phone: z.string({
				required_error: 'Phone is required'
			}),
			address: z.string({
				required_error: 'Address is required'
			})
		},
		{
			message: 'Patient data is required!'
		}
	)
});
const changeStatus = z.object({
	body: z.object({
		status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED], {
			message: 'Status must be ACTIVE, BLOCKED or DELETED'
		})
	})
});

const userValidations = {
	createAdmin,
	createDoctor,
	createPatient,
	changeStatus
};

export default userValidations;
