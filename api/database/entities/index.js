import { Task } from "./task.model.js";
import { User } from "./user.model.js";
import { Chapter } from "./chapter.model.js";
import { Question } from "./question.model.js";
import { QuizAttempt } from "./quizAttempt.model.js";
import { Award } from "./award.model.js";
import { UserProfile } from "./userProfile.model.js";

User.hasOne(UserProfile, { foreignKey: "userId", as: "profile" });
UserProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

Chapter.hasMany(Question, { foreignKey: "chapterId", as: "questions" });
Question.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

User.hasMany(QuizAttempt, { foreignKey: "userId", as: "quizAttempts" });
QuizAttempt.belongsTo(User, { foreignKey: "userId", as: "user" });

Chapter.hasMany(QuizAttempt, { foreignKey: "chapterId", as: "attempts" });
QuizAttempt.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

User.hasMany(Award, { foreignKey: "userId", as: "awards" });
Award.belongsTo(User, { foreignKey: "userId", as: "user" });

export { Task, User, Chapter, Question, QuizAttempt, Award, UserProfile };