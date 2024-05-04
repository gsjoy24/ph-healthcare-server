import { Doctor, Prisma, UserStatus } from '@prisma/client';
import prisma from '../../../utils/prisma';
import { IPaginationOptions } from '../../types/pagination';
import { doctorSearchableFields } from './doctor.constant';
type SpecialtyData = {
	specialtyId: string;
	isDeleted: boolean;
};

const getAllDoctors = async (params: any, options: IPaginationOptions) => {
	const { searchTerm, ...restFilterData } = params;
	const limit = options.limit ? Number(options.limit) : 2;
	const page = options.page ? (Number(options.page) - 1) * limit : 0;
	const sortBy = options.sortBy || 'createdAt';
	const sortOrder = options.sortOrder || 'desc';

	const conditions: Prisma.DoctorWhereInput[] = [
		{
			isDeleted: false
		}
	];

	if (searchTerm) {
		conditions.push({
			OR: doctorSearchableFields.map((field) => ({
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

	const result = await prisma.doctor.findMany({
		where: { AND: conditions },
		skip: page,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		}
	});

	const total = await prisma.doctor.count({
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

const getByIdFromDb = async (id: string) => {
	const result = await prisma.doctor.findUniqueOrThrow({
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

const updateIntoDB = async (id: string, data: Partial<Doctor> & { specialties: SpecialtyData[] }) => {
	const { specialties, ...restDocData } = data;
	// this will throw an error if doctor is not found
	await prisma.doctor.findUniqueOrThrow({
		where: {
			id: id,
			isDeleted: false
		}
	});

	const result = await prisma.$transaction(async (tx) => {
		const updatedDoctor = await tx.doctor.update({
			where: {
				id: id
			},
			data: restDocData
		});

		if (specialties && specialties.length > 0) {
			// filter out specialties to be added
			const addedSpecialties = specialties.filter((specialty) => !specialty.isDeleted);
			if (addedSpecialties.length > 0) {
				for (const specialty of addedSpecialties) {
					await tx.doctorSpecialties.create({
						data: {
							doctorId: id,
							specialtyId: specialty.specialtyId
						}
					});
				}
			}

			// filter our specialties to be deleted
			const deletedSpecialties = specialties.filter((specialty) => specialty.isDeleted);
			if (deletedSpecialties.length > 0) {
				for (const specialty of deletedSpecialties) {
					await tx.doctorSpecialties.deleteMany({
						where: {
							doctorId: id,
							specialtyId: specialty.specialtyId
						}
					});
				}
			}
		}

		return updatedDoctor;
	});

	return result;
};

const deleteFromDB = async (id: string) => {
	await prisma.doctor.findUniqueOrThrow({
		where: {
			id: id
		}
	});

	const result = await prisma.$transaction(async (tx) => {
		const deletedDoctor = await tx.doctor.delete({
			where: {
				id: id
			}
		});

		const deletedUser = await tx.user.delete({
			where: {
				email: deletedDoctor.email
			}
		});

		return deletedDoctor;
	});

	return result;
};

const softDeleteFromDB = async (id: string) => {
	await prisma.doctor.findUniqueOrThrow({
		where: {
			id: id
		}
	});

	const result = await prisma.$transaction(async (tx) => {
		const deletedDoctor = await tx.doctor.update({
			where: {
				id: id
			},
			data: {
				isDeleted: true
			}
		});

		const deletedUser = await tx.user.update({
			where: {
				email: deletedDoctor.email
			},
			data: {
				status: UserStatus.DELETED
			}
		});

		return deletedDoctor;
	});

	return result;
};

const DoctorServices = {
	getAllDoctors,
	getByIdFromDb,
	updateIntoDB,
	deleteFromDB,
	softDeleteFromDB
};
export default DoctorServices;
