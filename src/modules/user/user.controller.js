import ApiResponse from "../../common/utils/api-response.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { findUserById } from "./user.model.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);

  return ApiResponse.ok(res, "Current user fetched successfully", user);
});

export { getCurrentUser };
