import { Sequelize } from "sequelize";
const db = {
  NAME: "task",
  USERNAME: "task",
  PASSWORD: "task",
  options: {
    dialect: "mysql",
    timezone: "+00:00",
    host: "mysql.taskproject2",
    port: 3306,
    logging: function (str) {
      console.log(str);
    },
  },
};
export const sequelize = new Sequelize('db_name', 'db_user', 'db_pass', {
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
});
