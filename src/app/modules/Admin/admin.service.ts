import { Admin, Prisma, PrismaClient, userStatus } from '@prisma/client';
import { adminSearchableFields } from './admin.constant';
const prisma = new PrismaClient();

const getAllAdmins = async (params: any, options: any) => {
	const { searchTerm, ...restFilterData } = params;
	const limit = options.limit ? parseInt(options.limit) : 2;
	const page = options.page ? (parseInt(options.page) - 1) * limit : 0;
	const sortBy = options.sortBy || 'createdAt';
	const sortOrder = options.sortOrder || 'desc';

	const conditions: Prisma.AdminWhereInput[] = [
		{
			isDeleted: false
		}
	];

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
	const result = await prisma.admin.findUniqueOrThrow({
		where: {
			id: id,
			isDeleted: false
		}
	});
	return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
	// this will throw an error if admin is not found
	await prisma.admin.findUniqueOrThrow({
		where: {
			id: id
		}
	});

	const result = await prisma.admin.update({
		where: {
			id: id
		},
		data
	});
	return result;
};

const deleteFromDB = async (id: string) => {
	await prisma.admin.findUniqueOrThrow({
		where: {
			id: id
		}
	});

	const result = await prisma.$transaction(async (tx) => {
		const deletedAdmin = await tx.admin.update({
			where: {
				id: id
			},
			data: {
				isDeleted: true
			}
		});

		const deletedUser = await tx.user.update({
			where: {
				email: deletedAdmin.email
			},
			data: {
				status: userStatus.DELETED
			}
		});

		return deletedAdmin;
	});

	return result;
};

const AdminServices = {
	getAllAdmins,
	getAdminByIdFromDb,
	updateIntoDB,
	deleteFromDB
};
export default AdminServices;
