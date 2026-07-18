import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';

import { env } from "./src/config/env"
import routes from './src/routes/index';
import { generalLimiter } from './src/middlewares/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './src/middlewares/error.middleware';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS — only allow the actual frontend origin, with credentials for cookies
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Logging (dev only)
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global rate limiting
app.use(generalLimiter);

// API routes
app.use('/api/v1', routes);

// 404 handler — after all routes
app.use(notFoundHandler);

// Global error handler — must be last
app.use(errorHandler);

export default app;