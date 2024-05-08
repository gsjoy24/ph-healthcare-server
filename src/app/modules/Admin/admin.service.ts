import { Admin, Prisma, PrismaClient, UserStatus } from '@prisma/client';
import prisma from '../../../utils/prisma';
import { TPaginationOptions } from '../../types/pagination';
import { adminSearchableFields } from './admin.constant';
import { IAdminFilterRequest } from './admin.types';

const getAllAdmins = async (params: IAdminFilterRequest, options: TPaginationOptions) => {
	const { searchTerm, ...restFilterData } = params;
	const limit = options.limit ? Number(options.limit) : 10;
	const page = options.page ? (Number(options.page) - 1) * limit : 0;
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
					equals: (restFilterData as any)[key]
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

	const total = await prisma.admin.count({
		where: { AND: conditions }
	});

	return {
		meta: {
			limit,
			page,
			total
		},
		data: result
	};
};

const getAdminByIdFromDb = async (id: string) => {
	const result = await prisma.admin.findUniqueOrThrow({
		where: {
			id: id,
			isDeleted: false
		},
		include: {
			user: true
		}
	});
	return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
	// this will throw an error if admin is not found
	await prisma.admin.findUniqueOrThrow({
		where: {
			id: id,
			isDeleted: false
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
				status: UserStatus.DELETED
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
