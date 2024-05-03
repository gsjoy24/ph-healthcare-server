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

const SpecialtiesServices = {
	createSpecialty
};

export default SpecialtiesServices;
