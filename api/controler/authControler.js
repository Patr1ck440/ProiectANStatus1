import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../database/entities/user.model.js";

export async function authController(username, password) {
  if (!username || !password) {
    return { success: false, message: "Username and password are required" };
  }
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }
  const isValidPassword = await bcrypt.compare(
    password,
    user.dataValues.password,
  );
  if (!isValidPassword) {
    return { success: false, message: "Invalid credentials" };
  }
  const token = jwt.sign(
    {
      id: user.dataValues.id,
      username: user.dataValues.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  return { success: true, token };
}

