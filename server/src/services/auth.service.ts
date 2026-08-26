import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  };
};