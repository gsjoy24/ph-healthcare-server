import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../config';
import ApiError from '../../errors/ApiError';

const initPayment = async (paymentInitData: any) => {
	try {
		const { amount, transactionId, name, email, address, phone } = paymentInitData;
		const data = {
			store_id: config.sslcommerz_store_id,
			store_passwd: config.sslcommerz_store_password,
			total_amount: amount,
			currency: 'BDT',
			tran_id: transactionId,
			success_url: config.success_url,
			fail_url: config.failed_url,
			cancel_url: config.cancel_url,
			ipn_url: 'http://localhost:3030/ipn',
			shipping_method: 'N/A',
			product_name: 'Appointment',
			product_category: 'Service',
			product_profile: 'general',
			cus_name: name,
			cus_email: email,
			cus_add1: address,
			cus_add2: 'N/A',
			cus_city: 'N/A',
			cus_state: 'N/A',
			cus_postcode: 'N/A',
			cus_country: 'Bangladesh',
			cus_phone: phone,
			cus_fax: 'N/A',
			ship_name: 'N/A',
			ship_add1: 'N/A',
			ship_add2: 'N/A',
			ship_city: 'N/A',
			ship_state: 'N/A',
			ship_postcode: 1000,
			ship_country: 'Bangladesh'
		};

		const response = await axios({
			method: 'POST',
			url: config.ssl_payment_url,
			data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		return response.data;
	} catch (error) {
		throw new ApiError(httpStatus.BAD_GATEWAY, 'Payment initiation failed!');
	}
};

const validatePayment = async (payload: any) => {
	try {
		const response = await axios({
			method: 'GET',
			url: `${config.ssl_validation_url}?val_id=${payload.val_id}&store_id=${config.sslcommerz_store_id}&store_passwd=${config.sslcommerz_store_password}&format=json`
		});

		return response.data;
	} catch (error) {
		throw new ApiError(httpStatus.BAD_GATEWAY, 'Payment initiation failed!');
	}
};

const SSLServices = {
	initPayment,
	validatePayment
};

export default SSLServices;
