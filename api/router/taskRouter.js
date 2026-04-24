import { Router } from "express";
import { Task } from "../database/entities/index.js";
import { sequelize } from "../database/db.js";

const router = Router();

const tasks = [];

// GET all
router.get("/get-all", async (req, res) => {
  tasks.length = 0;

  const tasksForDB = await Task.findAll();

  tasksForDB.forEach((task) => {
    tasks.push({
      id: task.id,
      title: task.title,
      done: Boolean(task.done),
      favorite: Boolean(task.favorite),
    });
  });

  res.send(tasks);
});

// ADD
router.post("/add", async (req, res) => {
  const title = req.body.title;
  let task;

  const t = await sequelize.transaction();

  try {
    task = await Task.create({ title }, { transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).send({ error: "Failed to create task" });
  }

  res.send({
    id: task.id,
    title: task.title,
    done: false,
    favorite: false,
  });
});

// DELETE
router.delete("/delete", async (req, res) => {
  const id = req.body.id;

  await Task.destroy({ where: { id } });

  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) tasks.splice(index, 1);

  res.send({ success: true });
});

// UPDATE TITLE
router.put("/update-title", async (req, res) => {
  const { id, newTitle } = req.body;

  await Task.update({ title: newTitle }, { where: { id } });

  const task = tasks.find((t) => t.id === id);
  if (task) task.title = newTitle;

  res.send({ success: true });
});

// UPDATE DONE
router.put("/update-done", async (req, res) => {
  const { id } = req.body;

  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).send({ error: "Task not found" });

  await Task.update(
    { done: !task.done },
    { where: { id } }
  );

  task.done = !task.done;

  res.send({ success: true });
});

// UPDATE FAVORITE
router.put("/update-favorite", async (req, res) => {
  const { id } = req.body;

  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).send({ error: "Task not found" });

  await Task.update(
    { favorite: !task.favorite },
    { where: { id } }
  );

  task.favorite = !task.favorite;

  res.send({ success: true });
});

export default router;