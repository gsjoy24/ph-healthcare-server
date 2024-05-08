import { Prisma, PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import fileUploader from '../../../utils/fileUploader';
import calculatePagination from '../../../utils/paginationHelper';
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
	const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

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
		skip,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		},
		select: {
			id: true,
			email: true,
			role: true,
			createdAt: true,
			admin: true,
			doctor: true,
			patient: true
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

const changeStatus = async (id: string, status: UserStatus) => {
	await prisma.user.findUniqueOrThrow({
		where: {
			id
		}
	});
	const user = await prisma.user.update({
		where: {
			id
		},
		data: {
			status
		}
	});
	return user;
};

const getMyProfile = async (email: string) => {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			email,
			status: UserStatus.ACTIVE
		},
		select: {
			id: true,
			email: true,
			status: true,
			role: true,
			needPasswordChange: true,
			createdAt: true,
			updatedAt: true
		}
	});

	let userProfile;
	switch (user.role) {
		case UserRole.ADMIN:
			userProfile = await prisma.admin.findUnique({
				where: {
					email: user.email
				}
			});
			break;
		case UserRole.SUPER_ADMIN:
			userProfile = await prisma.admin.findUnique({
				where: {
					email: user.email
				}
			});
			break;
		case UserRole.DOCTOR:
			userProfile = await prisma.doctor.findUnique({
				where: {
					email: user.email
				}
			});
			break;
		case UserRole.PATIENT:
			userProfile = await prisma.patient.findUnique({
				where: {
					email: user.email
				}
			});
			break;
		default:
			break;
	}

	return { ...user, ...userProfile };
};

const updateProfile = async (email: string, payload: Request) => {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			email,
			status: UserStatus.ACTIVE
		}
	});

	const file = payload?.file;
	if (file) {
		const uploadedFile = await fileUploader.uploadToCloudinary(file);
		payload.body.profilePhoto = uploadedFile?.secure_url;
	}

	let userProfile;
	switch (user.role) {
		case UserRole.ADMIN:
			userProfile = await prisma.admin.update({
				where: {
					email: user.email
				},
				data: payload.body
			});
			break;
		case UserRole.SUPER_ADMIN:
			userProfile = await prisma.admin.update({
				where: {
					email: user.email
				},
				data: payload.body
			});
			break;
		case UserRole.DOCTOR:
			userProfile = await prisma.doctor.update({
				where: {
					email: user.email
				},
				data: payload.body
			});
			break;
		case UserRole.PATIENT:
			userProfile = await prisma.patient.update({
				where: {
					email: user.email
				},
				data: payload.body
			});
			break;
		default:
			break;
	}
	return userProfile;
};

const userServices = {
	createAdmin,
	createDoctor,
	createPatient,
	getAllUsers,
	changeStatus,
	getMyProfile,
	updateProfile
};

export default userServices;
