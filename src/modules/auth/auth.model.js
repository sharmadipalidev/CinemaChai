import bcrypt from "bcrypt";

import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/jwt.utils.js";
import {
  createUser,
  findUserByEmail,
  updateUserRefreshToken,
} from "../user/user.model.js";

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const buildAuthPayload = (user) => ({
  userId: user.id,
  email: user.email,
  fullName: user.full_name,
});

const buildAuthResponse = (user) => {
  const payload = buildAuthPayload(user);

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

const registerUserAccount = async ({ fullName, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw ApiError.conflict("A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = await createUser({
    fullName,
    email,
    passwordHash,
  });
  const tokens = buildAuthResponse(user);

  await updateUserRefreshToken(user.id, tokens.refreshToken);

  return {
    user,
    tokens,
  };
};

const loginUserAccount = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordCorrect) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const publicUser = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
  const tokens = buildAuthResponse(publicUser);

  await updateUserRefreshToken(user.id, tokens.refreshToken);

  return {
    user: publicUser,
    tokens,
  };
};

const logoutUserAccount = async (userId) => {
  await updateUserRefreshToken(userId, null);
};

export { registerUserAccount, loginUserAccount, logoutUserAccount };
