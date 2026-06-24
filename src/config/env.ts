import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://127.0.0.1:5173',
};
