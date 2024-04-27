import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import config from '../app/config';
import { ICloudinaryResponse, IFile } from '../app/types/file';

cloudinary.config({
	cloud_name: config.cloudinary_cloud_name,
	api_key: config.cloudinary_api_key,
	api_secret: config.cloudinary_api_secret
});
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(process.cwd(), '/uploads'));
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse> => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(file.path, (error: Error, result: ICloudinaryResponse) => {
			fs.unlinkSync(file.path);
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const upload = multer({ storage: storage });

const fileUploader = {
	upload,
	uploadToCloudinary
};

export default fileUploader;
