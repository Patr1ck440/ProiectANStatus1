// api/index.js  (sau app.js - înlocuiește fișierul existent)
import express from "express";
import cors from "cors";

// Import models + asocieri
import "../../database/entities/index.js";

// Import routere
import userRouter from "./router/userRouter.js";
import chapterRouter from "./router/chapterRouter.js";
import quizRouter from "./router/quizRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutele API
app.use("/api/users", userRouter);
app.use("/api/chapters", chapterRouter);
app.use("/api/quiz", quizRouter);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;