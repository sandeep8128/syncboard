import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};