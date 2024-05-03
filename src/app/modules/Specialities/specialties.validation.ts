import { z } from 'zod';

const createSpecialty = z.object({
	body: z.object({
		title: z.string({
			required_error: 'Specialty title is required'
		})
	})
});

const specialtiesValidations = {
	createSpecialty
};

export default specialtiesValidations;
