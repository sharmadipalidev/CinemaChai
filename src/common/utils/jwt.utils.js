import "dotenv/config";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const getRequiredEnv = (key, fallbackValue) => {
  const value = process.env[key]?.trim();
  return value || fallbackValue;
};

const ACCESS_TOKEN_SECRET = getRequiredEnv(
  "JWT_ACCESS_SECRET",
  "change-me-access-secret",
);
const ACCESS_TOKEN_EXPIRES_IN = getRequiredEnv("JWT_ACCESS_EXPIRES_IN", "15m");
const REFRESH_TOKEN_SECRET = getRequiredEnv(
  "JWT_REFRESH_SECRET",
  "change-me-refresh-secret",
);
const REFRESH_TOKEN_EXPIRES_IN = getRequiredEnv("JWT_REFRESH_EXPIRES_IN", "7d");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
};
