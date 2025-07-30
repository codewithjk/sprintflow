import express from 'express';
import authRoute from './routes/auth.routes'
import orgRoute from './routes/org.routes'
import taskRoute from './routes/task.routes'
import projectRoute from './routes/project.routes'
import webhookRoute from './routes/webhook.routes'
import { errorMiddleware } from './middlewares/error-handler.middleware';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import isAuthenticated from './middlewares/is-authenticated.middleware';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const allowedOrigin  = process.env.WEB_URL as string;

 
app.use(cors({
  origin: [allowedOrigin],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


//webhook routes with raw body
app.use('/api/webhook', webhookRoute);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);

// authenticated routes
app.use(isAuthenticated);
app.use('/api/org', orgRoute);
app.use('/api/project', projectRoute);
app.use('/api/task', taskRoute);




// error handling middleware.
app.use(errorMiddleware);

const server = app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});




server.on('error', (err) => {
    console.error('Server error:', err);
});