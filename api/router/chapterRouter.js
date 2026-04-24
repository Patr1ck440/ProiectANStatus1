import { Router } from "express";
import { Chapter, Question } from "../database/entities/index.js";

const router = Router();

// GET all chapters
router.get("/", async (req, res) => {
  try {
    const chapters = await Chapter.findAll({ order: [["orderIndex", "ASC"]] });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET published chapters only
router.get("/published/list", async (req, res) => {
  try {
    const chapters = await Chapter.findAll({
      where: { isPublished: true },
      order: [["orderIndex", "ASC"]],
    });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single chapter with questions
router.get("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findByPk(req.params.id, {
      include: [{ association: "questions" }],
    });
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET questions for a chapter
router.get("/:id/questions", async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { chapterId: req.params.id },
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET chapter stats
router.get("/:id/stats", async (req, res) => {
  try {
    const { QuizAttempt } = await import("../database/entities/index.js");
    const attempts = await QuizAttempt.findAll({
      where: { chapterId: req.params.id },
    });
    const avgScore =
      attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        : 0;
    res.json({
      totalAttempts: attempts.length,
      averageScore: avgScore.toFixed(1),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create chapter
router.post("/", async (req, res) => {
  try {
    const { title, description, orderIndex, isPublished } = req.body;
    const chapter = await Chapter.create({ title, description, orderIndex, isPublished });
    res.status(201).json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST add question to chapter
router.post("/:id/questions", async (req, res) => {
  try {
    const { text, correctAnswer, options, difficulty } = req.body;
    const question = await Question.create({
      text,
      correctAnswer,
      options,
      difficulty,
      chapterId: req.params.id,
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update chapter
router.put("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findByPk(req.params.id);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    await chapter.update(req.body);
    res.json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE chapter
router.delete("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findByPk(req.params.id);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    await chapter.destroy();
    res.json({ message: "Chapter deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE question from chapter
router.delete("/:id/questions/:qId", async (req, res) => {
  try {
    const question = await Question.findOne({
      where: { id: req.params.qId, chapterId: req.params.id },
    });
    if (!question) return res.status(404).json({ error: "Question not found" });
    await question.destroy();
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;