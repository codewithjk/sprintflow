import express from 'express';
import authRoute from './routes/auth.routes'
import { errorMiddleware } from './middlewares/error-handler.middleware';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// todo : delete this route later
app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoute);


// error handling middleware.
app.use(errorMiddleware);

const server = app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});




server.on('error', (err) => {
    console.error('Server error:', err);
});