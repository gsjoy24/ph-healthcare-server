import { PaymentStatus } from '@prisma/client';
import axios from 'axios';
import prisma from '../../../utils/prisma';
import config from '../../config';
import SSLServices from '../SSL/ssl.service';

const initPayment = async (appointmentId: string) => {
	const paymentData = await prisma.payment.findUniqueOrThrow({
		where: {
			appointmentId
		},
		include: {
			appointment: {
				include: {
					patient: true
				}
			}
		}
	});

	const paymentInitData = {
		amount: paymentData.amount,
		transactionId: paymentData.transactionId,
		name: paymentData.appointment.patient.name,
		email: paymentData.appointment.patient.email,
		address: paymentData.appointment.patient.address,
		phone: paymentData.appointment.patient.phone
	};

	const result = await SSLServices.initPayment(paymentInitData);

	return {
		paymentUrl: result.GatewayPageURL
	};
};

const validatePayment = async (payload: any) => {
	if (!payload || !payload.status || !(payload.status === 'VALID')) {
		return {
			message: 'Invalid payment!'
		};
	}
	const response = await SSLServices.validatePayment(payload);

	if (response.status !== 'VALID') {
		return {
			message: 'Invalid payment!'
		};
	}

	await prisma.$transaction(async (tx) => {
		await tx.payment.updateMany({
			where: {
				transactionId: response.tran_id
			},
			data: {
				status: PaymentStatus.PAID,
				paymentGatewayData: response
			}
		});
	});
};

const PaymentServices = {
	initPayment,
	validatePayment
};

export default PaymentServices;
