import { Router } from "express";

import { verifyJWT } from "../../common/middlewares/auth.middleware.js";
import { login, logout, register } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);

export default router;
