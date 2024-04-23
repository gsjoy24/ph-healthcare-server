import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { userRouter } from './app/modules/User/user.routes';

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

app.use('/api/v1/users', userRouter);

export default app;
