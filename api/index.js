// api/index.js
import express from "express";
import cors from "cors";

// 1. Import conexiunea Sequelize
import { sequelize } from "../database/db.js";

// 2. Importă toate modelele + relațiile
import "../database/entities/index.js";

// 3. Import routere
import userRouter from "./router/userRouter.js";
import chapterRouter from "./router/chapterRouter.js";
import quizRouter from "./router/quizRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

// 4. Rute API
app.use("/api/users", userRouter);
app.use("/api/chapters", chapterRouter);
app.use("/api/quiz", quizRouter);

// 5. Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 6. Sincronizare Sequelize (creează tabelele automat)
sequelize
  .sync({ alter: true }) // alter = creează/actualizează fără să șteargă date
  .then(() => console.log("✔ Sequelize: tabele create/actualizate"))
  .catch((err) => console.error("❌ Sequelize sync error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

export default app;
