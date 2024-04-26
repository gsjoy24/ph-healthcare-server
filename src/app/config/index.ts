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
	base_app_url: process.env.BASE_APP_URL
};
