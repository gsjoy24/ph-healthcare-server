import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllAdmins = async (params: any) => {
	console.log(params);
	const result = await prisma.admin.findMany({
		where: {
			OR: [
				{
					name: {
						contains: params?.search,
						mode: 'insensitive' // case-insensitive search
					}
				},
				{
					email: {
						contains: params?.search,
						mode: 'insensitive' // case-insensitive search
					}
				}
			]
		}
	});
	return result;
};

const AdminServices = {
	getAllAdmins
};
export default AdminServices;
