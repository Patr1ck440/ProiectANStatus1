import { Router } from "express";

const router = Router();

const USERNAME = "admin";
const PASSWORD = "admin";

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === USERNAME && password === PASSWORD) {
    res.send("Login successful");
  } else {
    res.send("Login failed");
  }
});

export default router;
