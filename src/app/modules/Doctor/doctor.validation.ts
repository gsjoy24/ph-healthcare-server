// import { z } from 'zod';

// const updateDoctor = z.object({
// 	body: z.object({
// 		name: z
// 			.string({
// 				invalid_type_error: 'Name must be a string'
// 			})
// 			.optional(),
// 		profilePhoto: z.string().optional(),
// 		email: z.string().email({
// 			message: 'Invalid email'
// 		}),
// 		phone: z.string({
// 			required_error: 'Phone is required'
// 		}),
// 		address: z.string({
// 			required_error: 'Address is required'
// 		}),
// 		registrationNumber: z.string({
// 			required_error: 'Registration number is required'
// 		}),
// 		experience: z
// 			.number({
// 				invalid_type_error: 'Experience must be a number'
// 			})
// 			.optional(),
// 		gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
// 			message: 'Gender must be male, female or other'
// 		}),
// 		appointmentFee: z.number({
// 			required_error: 'Appointment fee is required',
// 			invalid_type_error: 'Appointment fee must be a number'
// 		}),
// 		qualifications: z.string({
// 			required_error: 'Qualifications are required'
// 		}),
// 		currentWorkplace: z.string({
// 			required_error: 'Current workplace is required'
// 		}),
// 		designation: z.string({
// 			required_error: 'Designation is required'
// 		})
// 	})
// });
