import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  host: process.env.HOST || "0.0.0.0",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  corsAllowedOrigins: (
    process.env.CORS_ALLOWED_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || "kbd_jwt_super_secret_key_2026_change_in_production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  logLevel: process.env.LOG_LEVEL || "info",
  prismaLog:
    process.env.PRISMA_LOG !== undefined
      ? process.env.PRISMA_LOG === "true"
      : process.env.NODE_ENV === "development",
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCXEa7yf1O6mr7w-KbqZl_FJJqq9rdd148",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "kartu-bicara-digital-2f0ce.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "kartu-bicara-digital-2f0ce",
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || "kartu-bicara-digital-2f0ce.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "314652631775",
    appId: process.env.FIREBASE_APP_ID || "1:314652631775:web:571700af43272963807f6a",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-P8MRBLY589",
  },
};

export default config;
