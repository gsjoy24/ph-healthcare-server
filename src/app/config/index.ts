import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '/.env') });

export default {
	port: process.env.PORT,
	env: process.env.NODE_ENV,
	pass_salt: Number(process.env.PASS_SAIL),

	accessSecret: process.env.JWT_ACCESS_SECRET,
	refreshSecret: process.env.JWT_REFRESH_SECRET,
	accessSecretExp: process.env.JWT_ACCESS_SECRET_EXPIRATION,
	refreshSecretExp: process.env.JWT_REFRESH_EXPIRATION,
	reset_pass_secret: process.env.RESET_PASS_SECRET,
	reset_pass_secret_exp: process.env.RESET_PASS_SECRET_EXPIRATION,

	base_app_url: process.env.BASE_APP_URL,
	app_email: process.env.APP_EMAIL,
	app_password: process.env.APP_PASSWORD,

	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

	sslcommerz_store_id: process.env.SSLCOMMERZ_STORE_ID,
	sslcommerz_store_password: process.env.SSLCOMMERZ_STORE_PASSWORD
};
