// src/controllers/auth.controller.js
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";
import cookieOptions from "../utils/cookieOptions.js";

// Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Cek jika email sudah digunakan
  const existed = await prisma.user.findUnique({ where: { email } });
  if (existed) return errorResponse(res, "email is already in use", null, 400);

  // Hash password sebelum simpan ke DB
  const hashed = await bcrypt.hash(password, 10);

  // Simpan user baru ke db
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  return successResponse(res, "Register Successful", {
    id: user.id,
    name: user.name,
    email: user.email,
  });
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Cari user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return errorResponse(res, "email tidak ditemukan", null, 401);

  // Cocokkan password
  const match = await bcrypt.compare(password, user.password);
  if (!match) return errorResponse(res, "Password salah", null, 401);

  // Buat JWT Token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, cookieOptions(req));

  return successResponse(res, "Login Successful", {
    userId: user.id,
    email: email,
    token: token,
  });
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions(req),
    maxAge: undefined, // override maxAge biar cookie benar-benar terhapus
  });
  return successResponse(res, "logout successful");
};
