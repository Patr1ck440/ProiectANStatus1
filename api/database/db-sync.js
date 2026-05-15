import { sequelize } from "./db.js";
import bcrypt from "bcryptjs"

// Import din index.js ca să se înregistreze și asocierile
import "./entities/index.js";
import { User } from "./entities/user.model.js";

await sequelize.sync({ alter: true }).then(async () => {
  const passwordHash = await bcrypt.hash("admin123", 10)
  await User.findOrCreate({
    where: { username: "admin" },
    defaults: {
      name: "Administrator",
      username: "admin",
      password: passwordHash,
      email: "admin@example.com",
      phone: "0000000000",
    }
  })
  console.log("FINISHED SUCCESS");
  process.exit(0);
}).catch((error) => {
  console.error("Error syncing database:", error);
  process.exit(1);
});
