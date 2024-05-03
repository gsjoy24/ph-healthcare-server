import { Response } from 'express';
type ResponseData = {
	statusCode: number;
	success: boolean;
	message: string;
	data?: any;
	meta?: {
		limit: number;
		page: number;
		total: number;
	};
};
const sendResponse = (res: Response, data: ResponseData) => {
	const { statusCode, success, message, data: responseData, meta } = data;
	const resData: Partial<ResponseData> = {
		success,
		message
	};
	meta && (resData.meta = meta);
	responseData && (resData.data = responseData);

	res.status(statusCode).json(resData);
};

export default sendResponse;
