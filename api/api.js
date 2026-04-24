import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import authRouter from "./router/authRouter.js";
import taskRouter from "./router/taskRouter.js";
import chapterRouter from "./router/chapterRouter.js";
import quizRouter from "./router/quizRouter.js";
import universityRouter from "./router/universityRouter.js";
import userRouter from "./router/userRouter.js";

const api = express();
const port = 3000;

// CORS - înlocuiește tot middleware-ul manual cu asta:
api.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

api.use(bodyParser.json());

api.get("/", (req, res) => res.send("API is working 🚀"));

api.use("/api/auth", authRouter);
api.use("/api/tasks", taskRouter);
api.use("/api/chapters", chapterRouter);
api.use("/api/quiz", quizRouter);
api.use("/api/university", universityRouter);
api.use("/api/users", userRouter);

api.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
