import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	if (err) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
			status: false,
			message: err.name || 'Something went wrong!',
			error: err
		});
	}
	next();
});

export default app;
