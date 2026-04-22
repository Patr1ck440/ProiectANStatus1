import { sequelize } from "../db.js";

sequelize.sync({ force: true }).then(() => {
  console.log("FINISHED SUCCESS");
  process.exit(0);
});
