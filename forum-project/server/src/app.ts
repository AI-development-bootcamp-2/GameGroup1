import './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
