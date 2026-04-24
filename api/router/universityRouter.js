import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/an2", (req, res) => {
  res.send(JSON.stringify({ name: "An2" }));
});

export default router;
