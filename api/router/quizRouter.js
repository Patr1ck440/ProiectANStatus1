import { Router } from "express";
import {
  QuizAttempt,
  User,
  Chapter,
  Award,
} from "../database/entities/index.js";

const router = Router();

// GET all attempts
router.get("/", async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      include: [
        { association: "user", attributes: ["id", "username"] },
        { association: "chapter", attributes: ["id", "title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single attempt
router.get("/:id", async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByPk(req.params.id, {
      include: [{ association: "user" }, { association: "chapter" }],
    });

    if (!attempt) return res.status(404).json({ error: "Attempt not found" });

    res.json(attempt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET attempts by user
router.get("/user/:userId", async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: { userId: req.params.userId },
      include: [{ association: "chapter", attributes: ["id", "title"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET best per chapter
router.get("/user/:userId/best", async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: { userId: req.params.userId },
      order: [["score", "DESC"]],
    });

    const best = {};
    attempts.forEach((a) => {
      if (!best[a.chapterId] || a.score > best[a.chapterId].score) {
        best[a.chapterId] = a;
      }
    });

    res.json(Object.values(best));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET leaderboard
router.get("/leaderboard/global", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "points", "level"],
      order: [["points", "DESC"]],
      limit: 20,
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST quiz attempt
router.post("/", async (req, res) => {
  try {
    const { userId, chapterId, score, totalQuestions, correctAnswers } =
      req.body;

    const attempt = await QuizAttempt.create({
      userId,
      chapterId,
      score,
      totalQuestions,
      correctAnswers,
      completedAt: new Date(),
    });

    const user = await User.findByPk(userId);

    if (user) {
      user.points += score;
      user.level = Math.floor(user.points / 100) + 1;
      await user.save();

      if (correctAnswers === totalQuestions) {
        await Award.create({
          userId,
          title: "Scor Perfect!",
          description: "Ai răspuns corect la toate întrebările din capitol!",
          icon: "🏆",
        });
      }
    }

    res.status(201).json(attempt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// restul rutelor rămân IDENTICE
export default router;
