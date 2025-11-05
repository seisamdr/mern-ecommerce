// src/controllers/auth.controller.js
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";
import cookieOptions from "../utils/cookieOptions.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return errorResponse(
        res,
        "Name, email, and password are required",
        null,
        400
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "Email is already registered", null, 409);
    }

    // Hash password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user to database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return successResponse(res, "Registration successful", {
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return errorResponse(res, "Registration failed", null, 500);
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", null, 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse(res, "Invalid email or password", null, 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", null, 401);
    }

    // Create JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie
    res.cookie("token", token, cookieOptions(req));

    return successResponse(res, "Login successful", {
      userId: user.id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    return errorResponse(res, "Login failed", null, 500);
  }
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      ...cookieOptions(req),
      maxAge: undefined, // Override maxAge to ensure cookie is completely removed
    });
    return successResponse(res, "Logout successful");
  } catch (error) {
    return errorResponse(res, "Logout failed", null, 500);
  }
};

// // Get Current User
// export const getCurrentUser = async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.userId },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!user) {
//       return errorResponse(res, "User not found", null, 404);
//     }

//     return successResponse(res, "User retrieved successfully", user);
//   } catch (error) {
//     return errorResponse(res, "Failed to retrieve user data", null, 500);
//   }
// };
