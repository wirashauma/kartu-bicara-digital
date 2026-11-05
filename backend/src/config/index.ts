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
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCt7EIlSAXz1PIEYe0nIonx1pb_Vfyo9bM",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "kartu-bicara-digital.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "kartu-bicara-digital",
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || "kartu-bicara-digital.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "459346102485",
    appId: process.env.FIREBASE_APP_ID || "1:459346102485:web:c56a866244e676230cfa5c",
  },
};

export default config;
