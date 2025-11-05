import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// localhost:5025/api/auth/register
export default router;
