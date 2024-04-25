import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
