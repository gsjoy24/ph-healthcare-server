import nodemailer from 'nodemailer';
import config from '../app/config';
const emailSender = async (email: string, html: string) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false, // Use `true` for port 465, `false` for all other ports
		auth: {
			user: config.app_email,
			pass: config.app_password
		}
	});

	const info = await transporter.sendMail({
		from: '"PH Healthcare 🧰" <gour.joy24@gmail.com>',
		// to: email,
		to: 'goursaha307@gmail.com',
		subject: 'Reset Password Link',
		html
	});
};

export default emailSender;
