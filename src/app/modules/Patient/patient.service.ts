import { Patient, Prisma, UserStatus } from '@prisma/client';
import prisma from '../../../utils/prisma';
import { IPaginationOptions } from '../../types/pagination';
import { patientSearchableFields } from './patient.constant';

const getAllPatients = async (params: any, options: IPaginationOptions) => {
	const { searchTerm, ...restFilterData } = params;

	const limit = options.limit ? Number(options.limit) : 2;
	const page = options.page ? (Number(options.page) - 1) * limit : 0;
	const sortBy = options.sortBy || 'createdAt';
	const sortOrder = options.sortOrder || 'desc';

	const conditions: Prisma.PatientWhereInput[] = [
		{
			isDeleted: false
		}
	];

	if (searchTerm) {
		conditions.push({
			OR: patientSearchableFields.map((field) => ({
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

	const result = await prisma.patient.findMany({
		where: { AND: conditions },
		skip: page,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		},
		include: {
			patientHealthData: true,
			medicalReport: true
		}
	});

	const total = await prisma.patient.count({
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
	const result = await prisma.patient.findUniqueOrThrow({
		where: {
			id: id,
			isDeleted: false
		},
		include: {
			user: {
				select: {
					id: true,
					email: true,
					role: true,
					status: true,
					createdAt: true,
					updatedAt: true
				}
			}
		}
	});
	return result;
};

const updateIntoDB = async (id: string, data: Partial<Patient>) => {
	console.log('ss');
};

const deleteFromDB = async (id: string) => {
	await prisma.patient.findUniqueOrThrow({
		where: {
			id: id
		}
	});

	const result = await prisma.$transaction(async (tx) => {
		const deletedPatient = await tx.patient.delete({
			where: {
				id: id
			}
		});

		const deletedUser = await tx.user.delete({
			where: {
				email: deletedPatient.email
			}
		});

		return deletedPatient;
	});

	return result;
};

const softDeleteFromDB = async (id: string) => {
	await prisma.patient.findUniqueOrThrow({
		where: {
			id: id
		}
	});

	const result = await prisma.$transaction(async (tx) => {
		const deletedPatient = await tx.patient.update({
			where: {
				id: id
			},
			data: {
				isDeleted: true
			}
		});

		const deletedUser = await tx.user.update({
			where: {
				email: deletedPatient.email
			},
			data: {
				status: UserStatus.DELETED
			}
		});

		return deletedPatient;
	});

	return result;
};

const PatientServices = {
	getAllPatients,
	getByIdFromDb,
	updateIntoDB,
	deleteFromDB,
	softDeleteFromDB
};
export default PatientServices;
