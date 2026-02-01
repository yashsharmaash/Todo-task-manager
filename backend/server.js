import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.get('/ping', (req, res) => {
    res.status(200).send("ok");
});


app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/todos', todoRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.get('/ping', (req, res) => {
    res.status(200).send("ok");
});

app.get('/', (req, res) => {
    res.send('Api is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
