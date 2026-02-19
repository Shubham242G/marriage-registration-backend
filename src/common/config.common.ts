import * as dotenv from "dotenv";
dotenv.config({ override: true });

// SECURITY: Validate required environment variables
const requiredEnvVars = ["JWT_ACCESS_TOKEN_SECRET", "MONGOURI"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`SECURITY WARNING: Required environment variable ${envVar} is not set!`);
    // In production, you might want to throw an error instead
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

export const CONFIG = {
  PORT: process.env.PORT ? process.env.PORT : 3000,
  MONGO_URI: process.env.MONGO_URI ? process.env.MONGO_URI : "",
  // SECURITY FIX: Removed weak default secret - must be set via environment variable
  JWTACCESSTOKENSECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "",
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  ADMIN_EAMIL: process.env.ADMIN_EAMIL,
  ADMIN_NAME: process.env.ADMIN_NAME,
  APP_URL: process.env.APP_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
};
