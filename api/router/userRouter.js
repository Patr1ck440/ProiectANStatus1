// api/router/userRouter.js
import { Router } from "express";
import { User, UserProfile } from "../../database/entities/index.js";

const router = Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "deletedAt"] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single user by id (with profile)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "deletedAt"] },
      include: [{ association: "profile" }],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user's quiz attempts
router.get("/:id/attempts", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ association: "quizAttempts" }],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.quizAttempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET scoreboard - top users by points
router.get("/scoreboard/top", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "level", "points"],
      order: [["points", "DESC"]],
      limit: 10,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user awards
router.get("/:id/awards", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ association: "awards" }],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.awards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user (+ auto-create profile)
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    // Creare automată profil (one-to-one)
    await UserProfile.create({ userId: user.id });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST add points to user (folosit după quiz)
router.post("/:id/points", async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.points += points;
    // Level up logic
    user.level = Math.floor(user.points / 100) + 1;
    await user.save();
    res.json({ id: user.id, points: user.points, level: user.level });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, password } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ id: user.id, username: user.username, level: user.level, points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user
router.put("/:id", async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.update({ username, email });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update user profile (one-to-one)
router.put("/:id/profile", async (req, res) => {
  try {
    const { bio, avatarUrl, streak, lastLoginDate } = req.body;
    const profile = await UserProfile.findOne({ where: { userId: req.params.id } });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    await profile.update({ bio, avatarUrl, streak, lastLoginDate });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user (soft delete - paranoid)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user award
router.delete("/:id/awards/:awardId", async (req, res) => {
  try {
    const { Award } = await import("../../database/entities/index.js");
    const award = await Award.findOne({
      where: { id: req.params.awardId, userId: req.params.id },
    });
    if (!award) return res.status(404).json({ error: "Award not found" });
    await award.destroy();
    res.json({ message: "Award deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;