import express from "express";
import cors from "cors";

import universityRouter from "./router/universityRouter.js";

const api = express();
const port = 3000;

api.use(cors());
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

// routes
api.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "api",
    time: new Date().toISOString(),
  });
});

api.use("/university", universityRouter);

// start server
api.listen(port, "0.0.0.0", () => {
  console.log(`API running on port ${port}`);
});