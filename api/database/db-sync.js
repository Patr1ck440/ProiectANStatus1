/*import { sequelize } from "./db.js";

sequelize.sync({ force: true }).then(() => {
  console.log("FINISHED SUCCESS");
  process.exit(0);
});
*/
import { Task } from "./entities/task.model.js";
import { User } from "./entities/user.model.js";

Task.sync({ force: true }).then(() => {
  console.log("FINISHED SUCCESS");
  process.exit(0);
});
