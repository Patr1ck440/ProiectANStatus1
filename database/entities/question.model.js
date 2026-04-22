import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

export const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      // JSON array of possible answers
      type: DataTypes.JSON,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      defaultValue: "medium",
    },
    // FK: chapterId added via association in index.js
  },
  {
    sequelize,
    freezeTableName: true,
    paranoid: true,
  }
);