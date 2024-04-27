import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import fileUploader from '../../../utils/fileUploader';
import config from '../../config';
const prisma = new PrismaClient();

const createAdmin = async (payload: Record<string, any>) => {
	if (payload?.file) {
		const uploadedFile = await fileUploader.uploadToCloudinary(payload?.file);
		payload.body.admin.profilePhoto = uploadedFile?.secure_url;
	}

	const hashedPassword = await bcrypt.hash(payload.body?.password, config?.pass_salt);
	const userData = {
		email: payload.body?.admin?.email,
		password: hashedPassword,
		role: UserRole.ADMIN
	};
	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({ data: userData });
		const admin = await tx.admin.create({ data: payload.body?.admin });
		return { user, admin };
	});
	return result;
};

export const userServices = {
	createAdmin
};
