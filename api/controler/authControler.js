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

  const accessToken = jwt.sign(
    {
      id: user.dataValues.id,
      username: user.dataValues.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    {
      id: user.dataValues.id,
      username: user.dataValues.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  await User.update({ refreshToken }, { where: { id: user.dataValues.id } });

  return { success: true, accessToken, refreshToken };
}

export async function refreshTokenController(refreshToken) {
  if (!refreshToken) {
    return { success: false, message: "Refresh token required" };
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      return { success: false, message: "Invalid refresh token" };
    }

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    return { success: true, accessToken: newAccessToken };
  } catch (error) {
    return { success: false, message: "Invalid or expired refresh token" };
  }
}


