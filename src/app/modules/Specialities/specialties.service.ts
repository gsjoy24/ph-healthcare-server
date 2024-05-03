import { Specialties } from '@prisma/client';
import prisma from '../../../utils/prisma';

const createSpecialty = async (specialty: Specialties) => {
	const newSpecialty = await prisma.specialties.create({
		data: specialty
	});
	return newSpecialty;
};

const SpecialtiesServices = {
	createSpecialty
};

export default SpecialtiesServices;
