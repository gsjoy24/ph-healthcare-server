import { MedicalReport, Patient, PatientHealthData, Prisma, UserStatus } from '@prisma/client';
import calculatePagination from '../../../utils/paginationHelper';
import prisma from '../../../utils/prisma';
import { IPaginationOptions } from '../../types/pagination';
import { patientSearchableFields } from './patient.constant';

const getAllPatients = async (params: any, options: IPaginationOptions) => {
	const { searchTerm, ...restFilterData } = params;

	const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

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
		skip,
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
			},
			patientHealthData: true,
			medicalReport: true
		}
	});
	return result;
};

const updateIntoDB = async (
	id: string,
	payload: Partial<Patient> & { patientHealthData: PatientHealthData } & { medicalReport: MedicalReport }
) => {
	const { patientHealthData, medicalReport, ...restData } = payload;
	await getByIdFromDb(id);

	await prisma.$transaction(async (tx) => {
		// updating patient data
		await tx.patient.update({
			where: {
				id
			},
			data: restData,
			include: {
				patientHealthData: true,
				medicalReport: true
			}
		});

		// updating patient health data
		if (patientHealthData) {
			await tx.patientHealthData.upsert({
				where: {
					patientId: id
				},
				update: patientHealthData,
				create: {
					...patientHealthData,
					patientId: id
				}
			});
		}
		// updating patient medical report
		if (medicalReport) {
			await tx.medicalReport.create({
				data: {
					...medicalReport,
					patientId: id
				}
			});
		}
	});

	const updatedData = await getByIdFromDb(id);

	return updatedData;
};

const deleteFromDB = async (id: string) => {
	await prisma.patient.findUniqueOrThrow({
		where: {
			id: id
		}
	});

	const result = await prisma.$transaction(async (tx) => {
		// deleting patient health data and medical report
		await tx.patientHealthData.delete({
			where: {
				patientId: id
			}
		});
		await tx.medicalReport.deleteMany({
			where: {
				patientId: id
			}
		});

		const deletedPatient = await tx.patient.delete({
			where: {
				id: id
			}
		});

		await tx.user.delete({
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
