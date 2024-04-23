import { Prisma, PrismaClient } from '@prisma/client';
import { adminSearchableFields } from './admin.constant';
const prisma = new PrismaClient();

const getAllAdmins = async (params: any, options: any) => {
	const { searchTerm, ...restFilterData } = params;
	const limit = options.limit ? parseInt(options.limit) : 2;
	const page = options.page ? (parseInt(options.page) - 1) * limit : 0;
	const sortBy = options.sortBy || 'createdAt';
	const sortOrder = options.sortOrder || 'desc';

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
		skip: page,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		}
	});
	return {
		meta: {
			limit,
			page,
			total: result.length
		},
		data: result
	};
};

const getAdminByIdFromDb = async (id: string) => {
	const result = await prisma.admin.findUnique({
		where: {
			id: id
		}
	});
	return result;
};

const AdminServices = {
	getAllAdmins,
	getAdminByIdFromDb
};
export default AdminServices;
