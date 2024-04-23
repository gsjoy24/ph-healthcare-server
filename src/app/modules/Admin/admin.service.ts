import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllAdmins = async (params: any) => {
	const { searchTerm, ...restFilterData } = params;
	const searchableFields = ['name', 'email'];
	const conditions: Prisma.AdminWhereInput[] = [];

	if (searchTerm) {
		conditions.push({
			OR: searchableFields.map((field) => ({
				[field]: { contains: searchTerm, mode: 'insensitive' }
			}))
		});
	}

	if (Object.keys(restFilterData).length) {
		conditions.push({
			AND: Object.keys(restFilterData).map((key) => ({
				[key]: {
					equals: restFilterData[key]
				}
			}))
		});
	}
	const result = await prisma.admin.findMany({
		where: { AND: conditions }
	});
	return result;
};

const AdminServices = {
	getAllAdmins
};
export default AdminServices;
