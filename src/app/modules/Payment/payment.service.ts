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
	// if (!payload || !payload.status || !(payload.status === 'VALID')) {
	// 	return {
	// 		message: 'Invalid payment!'
	// 	};
	// }
	// const response = await SSLServices.validatePayment(payload);

	// if (response.status !== 'VALID') {
	// 	return {
	// 		message: 'Payment failed!'
	// 	};
   // }
   // ! ssl query string
	// amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=gours66390fe237411&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=73d3b1496a98bf088a34903b00c6ee76&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id
	const response = payload;

	await prisma.$transaction(async (tx) => {
		const updatedPaymentData = await tx.payment.update({
			where: {
				transactionId: response.tran_id
			},
			data: {
				status: PaymentStatus.PAID,
				paymentGatewayData: response
			}
		});

		await tx.appointment.update({
			where: {
				id: updatedPaymentData.appointmentId
			},
			data: {
				paymentStatus: PaymentStatus.PAID
			}
		});
	});

	return {
		message: 'Payment success!'
	};
};

const PaymentServices = {
	initPayment,
	validatePayment
};

export default PaymentServices;
