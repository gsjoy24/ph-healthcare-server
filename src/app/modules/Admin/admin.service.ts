import { Prisma, PrismaClient } from '@prisma/client';
import { adminSearchableFields } from './admin.constant';
const prisma = new PrismaClient();

const getAllAdmins = async (params: any, options: any) => {
	const { searchTerm, ...restFilterData } = params;

	const conditions: Prisma.AdminWhereInput[] = [];

	if (searchTerm) {
		conditions.push({
			OR: adminSearchableFields.map((field) => ({
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
		where: { AND: conditions },
		skip: options.page ? (parseInt(options.page) - 1) * parseInt(options.limit) : 0,
		take: options.limit ? parseInt(options.limit) : 2,
		orderBy: {
			[options.sortBy || 'createdAt']: options.sortOrder || 'desc'
		}
	});
	return result;
};

const AdminServices = {
	getAllAdmins
};
export default AdminServices;
