import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const verifyToken = (token: string, secret: Secret) => {
	let decodedData;
	try {
		decodedData = jwt.verify(token, secret) as JwtPayload;
	} catch (error) {
		throw new Error('You are not authorized!');
	}

	return decodedData;
};

export default verifyToken;
