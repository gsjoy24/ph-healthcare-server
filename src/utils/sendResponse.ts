import { Response } from 'express';
type ResponseData<T> = {
	statusCode: number;
	success: boolean;
	message: string;
	data?: T | null | undefined;
	meta?: {
		limit: number;
		page: number;
		total: number;
	};
};
const sendResponse = (res: Response, data: ResponseData<any>) => {
	const { statusCode, success, message, data: responseData, meta } = data;
	res.status(statusCode).json({
		success,
		message,
		meta: meta || null,
		data: responseData || null
	});
};

export default sendResponse;
