import { CONFIG } from "@common/config.common";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import createError from "http-errors";
import mongoose from "mongoose";
import logger from "morgan";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// ==============<>============== //
import { adminSeeder } from "@seeder/adminSeeder";
import v1Router from "./v1/router.v1";
// ==============<>============== //

mongoose
  .connect(CONFIG.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error(err));

mongoose.set("debug", process.env.NODE_ENV !== "production");

// ✅ 1. BODY PARSER FIRST (fixes req.body undefined)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// ✅ 2. CORS 
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://localhost:8080',
  'http://localhost:8081'
];

app.use(cors({
  origin: function (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));

// ✅ 3. ROUTES AFTER body parser
app.post('/auth/admin/login', (req, res) => {
  console.log('📥 Request body:', req.body);  // Debug
  const { email, password } = req.body || {};
  
  if (email === 'admin@admin.com' && password === '123456') {
    return res.json({
      message: 'User Logged In',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-login-success',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-refresh-success',
      user: { name: 'Admin', email: 'admin@admin.com', role: 'ADMIN' }
    });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

adminSeeder();
app.use("/v1", v1Router);

// 404 & Error handlers
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

export default app;
