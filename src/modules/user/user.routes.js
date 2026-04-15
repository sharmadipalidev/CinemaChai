import { Router } from "express";

import { verifyJWT } from "../../common/middlewares/auth.middleware.js";
import { getCurrentUser } from "./user.controller.js";

const router = Router();

router.get("/me", verifyJWT, getCurrentUser);

export default router;
