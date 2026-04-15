import ApiResponse from "../../common/utils/api-response.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import {
  loginUserAccount,
  logoutUserAccount,
  registerUserAccount,
} from "./auth.model.js";
import {
  validateLoginPayload,
  validateRegisterPayload,
} from "./auth.validation.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const attachAuthCookies = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
};

const register = asyncHandler(async (req, res) => {
  const payload = validateRegisterPayload(req.body);
  const result = await registerUserAccount(payload);

  attachAuthCookies(res, result.tokens);

  return ApiResponse.created(res, "User registered successfully", result);
});

const login = asyncHandler(async (req, res) => {
  const payload = validateLoginPayload(req.body);
  const result = await loginUserAccount(payload);

  attachAuthCookies(res, result.tokens);

  return ApiResponse.ok(res, "Login successful", result);
});

const logout = asyncHandler(async (req, res) => {
  await logoutUserAccount(req.user.id);
  clearAuthCookies(res);

  return ApiResponse.ok(res, "Logout successful");
});

export { register, login, logout };
