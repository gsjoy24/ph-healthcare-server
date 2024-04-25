const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessSecretExp = process.env.JWT_ACCESS_SECRET_EXPIRATION;
const refreshSecretExp = process.env.JWT_REFRESH_EXPIRATION;

const config = {
	accessSecret,
	refreshSecret,
	accessSecretExp,
	refreshSecretExp
};

export default config;
