import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';

import cookieParser from 'cookie-parser';

dotenv.config();

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 8000;

connectDB()

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.get('/', (req, res) => res.send('Hello World!'));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));