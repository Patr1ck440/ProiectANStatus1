import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "proiectan",     // baza corectă
  "root",          // user corect
  "root",          // parola corectă
  {
    host: "mysql", // ATENȚIE: acesta trebuie să fie EXACT "mysql"
    dialect: "mysql",
    timezone: "+00:00",
    port: 3306,
    logging: console.log,
  }
);
