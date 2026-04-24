import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

// Many awards belong to one User
export const Award = sequelize.define(
  "Award",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    earnedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // FK: userId added via association
  },
  {
    sequelize,
    freezeTableName: true,
    paranoid: true,
  }
);