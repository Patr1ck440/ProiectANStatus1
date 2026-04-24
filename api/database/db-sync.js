import { sequelize } from "./db.js";

// Import din index.js ca să se înregistreze și asocierile
import "./entities/index.js";

await sequelize.sync({ alter: true }).then(() => {
  console.log("FINISHED SUCCESS");
  process.exit(0);
});