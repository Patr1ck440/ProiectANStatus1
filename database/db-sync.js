// database/db-sync.js
// Înlocuiește conținutul existent cu acesta
// Importă index.js care definește toate modelele și asocierile

import "./entities/index.js";
import { sequelize } from "./db.js";

sequelize.sync({ force: true }).then(() => {
  console.log("FINISHED SUCCESS - toate tabelele create");
  process.exit(0);
});