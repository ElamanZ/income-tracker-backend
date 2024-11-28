import { Logger } from '@nestjs/common';
import { z } from 'zod';
import { createEnv } from './utils/env';




export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),

    DATABASE_URL: z.string().min(1, 'This env variable is required'),
    APP_URL: z.string().url(),
    PORT: z.string().min(1, 'This env variable is required'),

    // #? Nikita sms

    JWT_ACCESS_SECRET: z.string().min(1, 'This env variable is required'),
    JWT_REFRESH_SECRET: z.string().min(1, 'This env variable is required'),


    // CLOUDINARY_CLOUD_NAME: z.string().min(1, 'This env variable is required'),
    // CLOUDINARY_API_KEY: z.string().min(1, 'This env variable is required'),
    // CLOUDINARY_API_SECRET: z.string().min(1, 'This env variable is required'),

    // TELEGRAM_BOT_TOKEN: z.string().min(1, 'This env variable is required'),

  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_URL: process.env.DATABASE_URL,
    APP_URL: process.env.APP_URL,
    PORT: process.env.PORT,


    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

    // CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    // CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    // CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  },
});

const logger = new Logger('env');

logger.verbose(JSON.stringify(env, null, 2));
