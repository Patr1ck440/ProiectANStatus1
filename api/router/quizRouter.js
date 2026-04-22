// api/router/quizRouter.js
import { Router } from "express";
import { QuizAttempt, User, Chapter, Award } from "../../database/entities/index.js";

const router = Router();

// GET all attempts
router.get("/", async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      include: [{ association: "user", attributes: ["id", "username"] }, { association: "chapter", attributes: ["id", "title"] }],
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

// GET best attempt per chapter for a user
router.get("/user/:userId/best", async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: { userId: req.params.userId },
      order: [["score", "DESC"]],
    });
    // Keep only best per chapter
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

// GET global leaderboard based on attempts
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

// POST create quiz attempt (submit quiz)
router.post("/", async (req, res) => {
  try {
    const { userId, chapterId, score, totalQuestions, correctAnswers } = req.body;
    const attempt = await QuizAttempt.create({
      userId,
      chapterId,
      score,
      totalQuestions,
      correctAnswers,
      completedAt: new Date(),
    });

    // Add points to user
    const user = await User.findByPk(userId);
    if (user) {
      user.points += score;
      user.level = Math.floor(user.points / 100) + 1;
      await user.save();

      // Award if perfect score
      if (correctAnswers === totalQuestions) {
        await Award.create({
          userId,
          title: "Scor Perfect!",
          description: `Ai răspuns corect la toate întrebările din capitol!`,
          icon: "🏆",
        });
      }
    }

    res.status(201).json(attempt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST submit answer (single question check)
router.post("/check-answer", async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const { Question } = await import("../../database/entities/index.js");
    const question = await Question.findByPk(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });
    const isCorrect = question.correctAnswer === answer;
    res.json({ isCorrect, correctAnswer: question.correctAnswer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST add award manually
router.post("/awards", async (req, res) => {
  try {
    const { userId, title, description, icon } = req.body;
    const award = await Award.create({ userId, title, description, icon });
    res.status(201).json(award);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update attempt score
router.put("/:id", async (req, res) => {
  try {
    const { score, correctAnswers } = req.body;
    const attempt = await QuizAttempt.findByPk(req.params.id);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    await attempt.update({ score, correctAnswers, completedAt: new Date() });
    res.json(attempt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update award
router.put("/awards/:id", async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const award = await Award.findByPk(req.params.id);
    if (!award) return res.status(404).json({ error: "Award not found" });
    await award.update({ title, description, icon });
    res.json(award);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT mark attempt as reviewed
router.put("/:id/review", async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByPk(req.params.id);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    await attempt.update({ completedAt: new Date() });
    res.json(attempt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE attempt
router.delete("/:id", async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByPk(req.params.id);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    await attempt.destroy();
    res.json({ message: "Attempt deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all attempts for a user
router.delete("/user/:userId/all", async (req, res) => {
  try {
    await QuizAttempt.destroy({ where: { userId: req.params.userId } });
    res.json({ message: "All attempts deleted for user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;