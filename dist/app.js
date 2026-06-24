import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { attractionRouter } from './routes/attractions.routes.js';
import { planRouter } from './routes/plans.routes.js';
import { userRouter } from './routes/users.routes.js';
import { maintenanceRouter } from './routes/maintenance.routes.js';
export const app = express();
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: env.frontendOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.resolve(env.uploadDir)));
app.use('/sample-plans', express.static(path.resolve('sample-plans')));
app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'parque-cafe-planimetria-backend' });
});
app.use('/api/auth', authRouter);
app.use('/api/attractions', attractionRouter);
app.use('/api/plans', planRouter);
app.use('/api/users', userRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
