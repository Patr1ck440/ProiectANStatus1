import "./entities/index.js";
import { sequelize } from "./db.js";

sequelize.sync({ force: true })
  .then(() => {
    console.log("FINISHED SUCCESS - toate tabelele create");
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR:", err);
    process.exit(1);
  });
