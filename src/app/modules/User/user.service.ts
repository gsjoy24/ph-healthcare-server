import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import fileUploader from '../../../utils/fileUploader';
import config from '../../config';
import { IPaginationOptions } from '../../types/pagination';
import { userSearchableFields } from './user.constant';
const prisma = new PrismaClient();

const createAdmin = async (payload: Request) => {
	if (payload?.file) {
		const uploadedFile = await fileUploader.uploadToCloudinary(payload?.file);
		payload.body.admin.profilePhoto = uploadedFile?.secure_url;
	}

	const hashedPassword = await bcrypt.hash(payload.body?.password, config?.pass_salt);
	const userData = {
		email: payload.body?.admin?.email,
		password: hashedPassword,
		role: UserRole.ADMIN
	};
	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({ data: userData });
		const admin = await tx.admin.create({ data: payload.body?.admin });
		return { user, admin };
	});
	return result;
};

const createDoctor = async (payload: Request) => {
	if (payload?.file) {
		const uploadedFile = await fileUploader.uploadToCloudinary(payload?.file);
		payload.body.doctor.profilePhoto = uploadedFile?.secure_url;
	}

	const hashedPassword = await bcrypt.hash(payload.body?.password, config?.pass_salt);

	const userData = {
		email: payload.body?.doctor?.email,
		password: hashedPassword,
		role: UserRole.DOCTOR
	};

	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({ data: userData });
		const doctor = await tx.doctor.create({ data: payload.body?.doctor });
		return { user, doctor };
	});
	return result;
};

const createPatient = async (payload: Request) => {
	if (payload?.file) {
		const uploadedFile = await fileUploader.uploadToCloudinary(payload?.file);
		payload.body.patient.profilePhoto = uploadedFile?.secure_url;
	}

	const hashedPassword = await bcrypt.hash(payload.body?.password, config?.pass_salt);

	const userData = {
		email: payload.body?.patient?.email,
		password: hashedPassword,
		role: UserRole.PATIENT
	};

	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({ data: userData });
		const patient = await tx.patient.create({ data: payload.body?.patient });
		return { user, patient };
	});
	return result;
};

const getAllUsers = async (params: any, options: IPaginationOptions) => {
	const { searchTerm, ...restFilterData } = params;
	const limit = options.limit ? Number(options.limit) : 2;
	const page = options.page ? (Number(options.page) - 1) * limit : 0;
	const sortBy = options.sortBy || 'createdAt';
	const sortOrder = options.sortOrder || 'desc';

	const conditions: Prisma.UserWhereInput[] = [];

	if (searchTerm) {
		conditions.push({
			OR: userSearchableFields.map((field) => ({
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

	const result = await prisma.user.findMany({
		where: { AND: conditions },
		skip: page,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		}
	});

	const total = await prisma.user.count({
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

export const userServices = {
	createAdmin,
	createDoctor,
	createPatient,
	getAllUsers
};
