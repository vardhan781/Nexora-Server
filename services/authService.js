import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import Role from "../models/roleModel.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "12h" });
};

export const loginService = async (email, password) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
    isActive: true,
  })
    .select("+password")
    .populate("role");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  user.password = undefined;

  return {
    user,
    token,
  };
};

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId).populate("role").select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
