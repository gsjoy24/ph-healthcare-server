import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Server } from 'http';
import app from './app';
import config from './app/config';
import prisma from './utils/prisma';

const superAdminInfo = {
	password: '123456',
	admin: {
		name: 'Super Admin',
		email: 'superAdmin@gmail.com',
		phone: '01777777777',
		profilePhoto: 'https://simgbb.com/avatar/MMzqKn2jWJtM.jpg'
	}
};

const createSuperAdmin = async (payload: any) => {
	// Check if super admin already exists
	const user = await prisma.user.findUnique({ where: { email: payload?.admin?.email } });
	if (user) return;

	const hashedPassword = await bcrypt.hash(payload?.password, config?.pass_salt);
	const userData = {
		email: payload?.admin?.email,
		password: hashedPassword,
		role: UserRole.SUPER_ADMIN
	};

	await prisma.$transaction(async (tx) => {
		await tx.user.create({ data: userData });
		await tx.admin.create({ data: payload?.admin });
	});

	return;
};

async function main() {
	const server: Server = app.listen(config.port, () => {
		console.log(`Server is running on http://localhost:${config.port}`);
	});
	createSuperAdmin(superAdminInfo);

	process.on('uncaughtException', (err) => {
		if (server) server.close(() => console.log('Server closed!'));
		process.exit(1);
	});

	process.on('unhandledRejection', () => {
		if (server) server.close(() => console.log('Server closed!'));
		process.exit(1);
	});
}
main();
