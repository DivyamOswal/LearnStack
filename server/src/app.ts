import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';

import { env } from "./config/env"
import routes from './routes/index';
import { generalLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

// Render (and most PaaS providers) sit behind a reverse proxy that sets
// X-Forwarded-For. Trusting the first proxy hop lets express-rate-limit
// (and req.ip) correctly identify the real client IP instead of Render's proxy IP.
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS LearnStack only allow the actual frontend origin, with credentials for cookies
// Strips a trailing slash from CLIENT_URL before comparing, since
// "https://example.com" and "https://example.com/" are different strings
// but should be treated as the same origin.
const allowedOrigin = env.CLIENT_URL.replace(/\/$/, '');

app.use(
  cors({
    origin: allowedOrigin,
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

// 404 handler LearnStack after all routes
app.use(notFoundHandler);

// Global error handler LearnStack must be last
app.use(errorHandler);

export default app;