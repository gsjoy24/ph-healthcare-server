import { PrismaClient, userRole } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const createAdmin = async (payload: Record<string, any>) => {
	const hashedPassword = await bcrypt.hash(payload.password, 12);
	const userData = {
		email: payload.admin.email,
		password: hashedPassword,
		role: userRole.ADMIN
	};
	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({ data: userData });
		const admin = await tx.admin.create({ data: payload.admin });
		return { user, admin };
	});
	return result;
};

export const userServices = {
	createAdmin
};