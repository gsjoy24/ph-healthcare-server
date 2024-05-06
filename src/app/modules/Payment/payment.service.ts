import axios from 'axios';
import prisma from '../../../utils/prisma';
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

const PaymentServices = {
	initPayment
};

export default PaymentServices;
