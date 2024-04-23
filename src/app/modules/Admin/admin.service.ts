import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllAdmins = async () => {
	const result = await prisma.admin.findMany();
	return result;
};

const AdminServices = {
	getAllAdmins
};
export default AdminServices;
