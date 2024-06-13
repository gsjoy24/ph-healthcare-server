import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import apiError from '../app/errors/apiError';

const verifyToken = (token: string, secret: Secret) => {
	let decodedData;
	try {
		decodedData = jwt.verify(token, secret) as JwtPayload;
	} catch (error) {
		throw new apiError(498, 'Jwt token is expired or invalid!');
	}
	return decodedData;
};

export default verifyToken;
