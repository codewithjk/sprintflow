import express from 'express';
import authRoute from './routes/auth.routes'
import orgRoute from './routes/org.routes'
import taskRoute from './routes/task.routes'
import projectRoute from './routes/project.routes'
import adminRoute from './routes/admin.routes'
import fileUploadRoute from './routes/upload.routes'
import webhookRoute from './routes/webhook.routes'
import meetingRoute from './routes/meeting.routes'
import { errorMiddleware } from './middlewares/error-handler.middleware';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import isAuthenticated from './middlewares/is-authenticated.middleware';
import { Server } from 'socket.io';
import { ChatSocketHandler } from './sockets/chat-socket.handler';
import { createServer } from 'http';

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
app.use('/api/meeting', meetingRoute);
app.use('/api/admin', adminRoute);
app.use("/api/upload", fileUploadRoute);




// error handling middleware.
app.use(errorMiddleware);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});
new ChatSocketHandler(io)

 server.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});






server.on('error', (err) => {
    console.error('Server error:', err);
});