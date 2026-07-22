import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const colors: Record<LogLevel, string> = {
  info: '\x1b[36m',  // cyan
  warn: '\x1b[33m',  // yellow
  error: '\x1b[31m', // red
  debug: '\x1b[35m', // magenta
};

const reset = '\x1b[0m';

const timestamp = () => new Date().toISOString();

const formatMessage = (level: LogLevel, message: string, meta?: unknown): string => {
  const base = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;

  if (meta === undefined) return base;

  const metaString =
    meta instanceof Error
      ? `\n${meta.stack ?? meta.message}`
      : typeof meta === 'object'
      ? `\n${JSON.stringify(meta, null, 2)}`
      : ` ${String(meta)}`;

  return `${base}${metaString}`;
};

const write = (level: LogLevel, message: string, meta?: unknown) => {
  const formatted = formatMessage(level, message, meta);

  // In production, skip ANSI color codes LearnStack most log viewers (Render's included)
  // either strip them or render raw escape characters, which is noisier than plain text.
  const output = env.NODE_ENV === 'production' ? formatted : `${colors[level]}${formatted}${reset}`;

  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
};

export const logger = {
  info: (message: string, meta?: unknown) => write('info', message, meta),
  warn: (message: string, meta?: unknown) => write('warn', message, meta),
  error: (message: string, meta?: unknown) => write('error', message, meta),
  debug: (message: string, meta?: unknown) => {
    // Debug logs only fire outside production LearnStack keeps noisy diagnostic
    // logging out of your Render logs once deployed.
    if (env.NODE_ENV !== 'production') {
      write('debug', message, meta);
    }
  },
};