import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "task",
  "task",
  "task",
  {
    host: "mysql",
    dialect: "mysql",
    port: 3306,
    logging: false,
    timezone: "+00:00",
  }
);
