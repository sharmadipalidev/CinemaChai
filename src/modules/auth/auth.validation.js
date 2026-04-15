import ApiError from "../../common/utils/api-error.js";

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateRegisterPayload = (payload) => {
  const fullName = payload.fullName?.trim();
  const email = payload.email?.trim();
  const password = payload.password?.trim();

  if (!fullName || !email || !password) {
    throw ApiError.badRequest("fullName, email and password are required");
  }

  if (fullName.length < 2) {
    throw ApiError.badRequest("fullName must be at least 2 characters long");
  }

  if (!validateEmail(email)) {
    throw ApiError.badRequest("Please provide a valid email address");
  }

  if (password.length < 6) {
    throw ApiError.badRequest("Password must be at least 6 characters long");
  }

  return {
    fullName,
    email: normalizeEmail(email),
    password,
  };
};

const validateLoginPayload = (payload) => {
  const email = payload.email?.trim();
  const password = payload.password?.trim();

  if (!email || !password) {
    throw ApiError.badRequest("email and password are required");
  }

  if (!validateEmail(email)) {
    throw ApiError.badRequest("Please provide a valid email address");
  }

  return {
    email: normalizeEmail(email),
    password,
  };
};

export { validateRegisterPayload, validateLoginPayload };
