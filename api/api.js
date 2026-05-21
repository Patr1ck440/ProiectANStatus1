import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRouter from "./router/authRouter.js";
import taskRouter from "./router/taskRouter.js";
import chapterRouter from "./router/chapterRouter.js";
import quizRouter from "./router/quizRouter.js";
import universityRouter from "./router/universityRouter.js";
import userRouter from "./router/userRouter.js";
import authMiddleware from "./router/authMiddleware.js";

const api = express();
const port = 3000;

const httpServer = createServer(api);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

api.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

api.use(bodyParser.json());

api.get("/", (req, res) => res.send("API is working 🚀"));

api.use("/api/auth", authRouter);
api.use("/api/tasks", taskRouter);
api.use("/api/chapters", chapterRouter);
api.use("/api/quiz", quizRouter);
api.use("/api/university", universityRouter);
api.use("/api/users", userRouter);

// WebSocket events
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on("task:created", (data) => {
    io.emit("task:updated", data);
  });

  socket.on("task:updated", (data) => {
    io.emit("task:changed", data);
  });

  socket.on("task:deleted", (data) => {
    io.emit("task:removed", data);
  });
});

httpServer.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

