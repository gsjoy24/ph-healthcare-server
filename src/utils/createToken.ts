import jwt from 'jsonwebtoken';
const createToken = (data: any, secret: string, expiresIn: string) => {
	const token = jwt.sign(data, secret, {
		expiresIn,
		algorithm: 'HS256'
	});
	return token;
};

export default createToken;
