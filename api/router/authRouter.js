import { Router } from "express";
import { authController, refreshTokenController } from "../controler/authControler.js";
const router = Router();

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const result = await authController(username, password);
    res.send(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    const result = await refreshTokenController(refreshToken);
    res.send(result);
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

export default router;
