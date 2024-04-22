import cors from 'cors';
import express, { Application, Request, Response } from 'express';
const app: Application = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
	res.send({
		status: 'success',
		message: 'Ph Health Care API is running!'
	});
});

export default app;
