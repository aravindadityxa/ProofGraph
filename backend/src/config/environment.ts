import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: (process.env.PORT || 3000) as number,
  nodeEnv: (process.env.NODE_ENV || 'development') as string,
  mongodbUri: (process.env.MONGODB_URI || 'mongodb://localhost:27017/proofgraph') as string,
  jwt: {
    secret: (process.env.JWT_SECRET || 'default-secret-change-in-production') as string,
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as string,
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:4200') as string,
  },
};
