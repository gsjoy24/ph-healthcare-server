import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '/.env') });

export default {
	port: process.env.PORT,
	env: process.env.NODE_ENV,
	accessSecret: process.env.JWT_ACCESS_SECRET,
	refreshSecret: process.env.JWT_REFRESH_SECRET,
	accessSecretExp: process.env.JWT_ACCESS_SECRET_EXPIRATION,
	refreshSecretExp: process.env.JWT_REFRESH_EXPIRATION
};
