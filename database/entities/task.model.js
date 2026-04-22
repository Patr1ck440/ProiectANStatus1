import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

export const Task = sequelize.define(
  "Task",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
    favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    paranoid: true,
  },
);
