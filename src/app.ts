import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import cron from 'node-cron';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import AppointmentServices from './app/modules/Appointment/appointment.service';
import router from './app/routes';

const app: Application = express();

app.use(
	cors({
		origin: ['http://localhost:3000'],
		credentials: true
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cron.schedule('* * * * *', () => {
	try {
		AppointmentServices.cancelUnpaidAppointments();
	} catch (error) {
		console.error('Error in cancelling unpaid appointments:', error);
	}
});

app.get('/', (req: Request, res: Response) => {
	res.send({
		status: 'success',
		message: 'Ph Health Care API is running!'
	});
});

app.use('/api/v1', router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
