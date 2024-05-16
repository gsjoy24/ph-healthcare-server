import { Specialties } from '@prisma/client';
import { Request } from 'express';
import fileUploader from '../../../utils/fileUploader';
import prisma from '../../../utils/prisma';

const createSpecialty = async (req: Request) => {
	const file = req.file;
	if (file) {
		const uploadedFile = await fileUploader.uploadToCloudinary(file);
		req.body.icon = uploadedFile?.secure_url;
	}
	const newSpecialty = await prisma.specialties.create({
		data: req.body
	});
	return newSpecialty;
};

const getSpecialties = async () => {
	const specialties = await prisma.specialties.findMany();
	return specialties;
};

const deleteSpecialty = async (id: string) => {
	console.log(id);
	const specialty = await prisma.specialties.delete({
		where: {
			id
		}
	});
	return specialty;
};

const SpecialtiesServices = {
	createSpecialty,
	getSpecialties,
	deleteSpecialty
};

export default SpecialtiesServices;
