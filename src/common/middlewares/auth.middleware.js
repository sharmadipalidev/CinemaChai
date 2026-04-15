import ApiError from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";
import { findUserById } from "../../modules/user/user.model.js";

const extractBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
};

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    extractBearerToken(req.get("Authorization") || "");

  if (!token) {
    throw ApiError.unauthorized("Access token is required");
  }

  let decodedToken;
  try {
    decodedToken = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired access token");
  }

  const userId =
    decodedToken.userId ?? decodedToken.id ?? decodedToken._id ?? null;

  if (!userId) {
    throw ApiError.unauthorized("Token payload is invalid");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw ApiError.unauthorized("User not found for this token");
  }

  req.user = user;
  req.auth = decodedToken;

  next();
});

export { verifyJWT };
