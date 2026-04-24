import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

// One-to-one with User
export const UserProfile = sequelize.define(
  "UserProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastLoginDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // FK: userId added via association
  },
  {
    sequelize,
    freezeTableName: true,
    paranoid: true,
  }
);