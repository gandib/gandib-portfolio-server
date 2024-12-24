import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import path from 'path';

const app: Application = express();

// parser
app.use(express.json());
app.use(
  // cors(),
  cors({
    credentials: true,
    origin: [
      'https://gandib-portfolio.vercel.app/',
      'https://gandib-portfolio-dashboard.vercel.app/',
      'http://localhost:3000',
    ],
  }),
);

app.use(express.static(path.join(__dirname, 'public')));

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
