import { PaymentStatus } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../utils/prisma';
import apiError from '../../errors/apiError';

const getDashboardMetaData = async (user: JwtPayload) => {
	switch (user.role) {
		case 'SUPER_ADMIN':
			return await getSuperAdminMetaData();
		case 'ADMIN':
			return await getAdminMetaData();
		case 'DOCTOR':
			return await getDoctorMetaData(user.email);
		case 'PATIENT':
			return await getPatientMetaData(user.email);
		default:
			new apiError(httpStatus.BAD_REQUEST, 'Invalid user role');
	}
};

const getSuperAdminMetaData = async () => {
	const adminCount = await prisma.admin.count();
	const data = await getAdminMetaData();

	return {
		adminCount,
		...data
	};
};

const getAdminMetaData = async () => {
	const appointmentCount = await prisma.appointment.count();
	const doctorCount = await prisma.doctor.count();
	const patientCount = await prisma.patient.count();
	const paymentCount = await prisma.payment.count();
	const totalRevenue = await prisma.payment.aggregate({
		_sum: {
			amount: true
		},
		where: {
			status: PaymentStatus.PAID
		}
	});
	const barChartData = await getBarChartData();
	const pieChartData = await getPieChartData();

	return {
		barChartData,
		pieChartData,
		appointmentCount,
		doctorCount,
		patientCount,
		paymentCount,
		totalRevenue: totalRevenue._sum.amount
	};
};

const getDoctorMetaData = async (email: string) => {
	const doctorData = await prisma.doctor.findUniqueOrThrow({
		where: {
			email
		}
	});
	const appointmentCount = await prisma.appointment.count({
		where: {
			doctorId: doctorData.id
		}
	});

	const patientCount = await prisma.appointment.groupBy({
		by: ['patientId'],
		where: {
			doctorId: doctorData.id
		},
		_count: { id: true }
	});

	const reviewCount = await prisma.review.count({
		where: {
			doctorId: doctorData.id
		}
	});

	const totalRevenue = await prisma.payment.aggregate({
		_sum: {
			amount: true
		},
		where: {
			appointment: {
				doctorId: doctorData.id
			},
			status: PaymentStatus.PAID
		}
	});

	const appointmentStatusDistribution = await prisma.appointment.groupBy({
		by: ['status'],
		_count: { id: true },
		where: {
			doctorId: doctorData.id
		}
	});

	const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => {
		return {
			status: status,
			count: _count.id
		};
	});

	return {
		appointmentCount,
		patientCount: patientCount.length,
		reviewCount,
		totalRevenue: totalRevenue._sum.amount,
		appointmentStatusDistribution: formattedAppointmentStatusDistribution
	};
};

const getPatientMetaData = async (email: string) => {
	const patientData = await prisma.patient.findUniqueOrThrow({
		where: {
			email
		}
	});

	const appointmentCount = await prisma.appointment.count({
		where: {
			patientId: patientData.id
		}
	});

	const prescriptionCount = await prisma.prescription.count({
		where: {
			patientId: patientData.id
		}
	});

	const reviewCount = await prisma.review.count({
		where: {
			patientId: patientData.id
		}
	});

	const appointmentStatusDistribution = await prisma.appointment.groupBy({
		by: ['status'],
		_count: { id: true },
		where: {
			patientId: patientData.id
		}
	});

	const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => {
		return {
			status: status,
			count: _count.id
		};
	});

	return {
		appointmentCount,
		prescriptionCount,
		reviewCount,
		appointmentStatusDistribution: formattedAppointmentStatusDistribution
	};
};

const getBarChartData = async () => {
	const appointmentCountByMonth = await prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") AS month,
      CAST(COUNT(*) AS INTEGER) as count
      FROM "appointments"
      GROUP BY month
      ORDER BY month ASC
      `;

	return appointmentCountByMonth;
};

const getPieChartData = async () => {
	const appointmentStatusDistribution = await prisma.appointment.groupBy({
		by: ['status'],
		_count: { id: true }
	});

	const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => {
		return {
			status: status,
			count: _count.id
		};
	});

	return formattedAppointmentStatusDistribution;
};

const MetaServices = {
	getDashboardMetaData
};

export default MetaServices;
