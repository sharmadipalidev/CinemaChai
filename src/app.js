import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import errorHandler from "./common/middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import bookingRoutes from "./modules/booking/booking.routes.js";
import { initializeBookingSchema } from "./modules/booking/booking.model.js";
import { initializeUserSchema } from "./modules/user/user.model.js";
import userRoutes from "./modules/user/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.trim() || true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Book My Ticket backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(bookingRoutes);

app.use(errorHandler);

const initializeApplication = async () => {
  await initializeUserSchema();
  await initializeBookingSchema();
};

export { app, initializeApplication };
export default app;
