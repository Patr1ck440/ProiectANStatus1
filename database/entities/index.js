// database/entities/index.js
// Central file that imports all models and defines associations between them.

import { User } from "./user.model.js";
import { UserProfile } from "./userProfile.model.js";
import { Chapter } from "./chapter.model.js";
import { Question } from "./question.model.js";
import { QuizAttempt } from "./quizAttempt.model.js";
import { Award } from "./award.model.js";
import { Task } from "./task.model.js";

// ─── ONE-TO-ONE ─────────────────────────────────────────────────────────────
// Un utilizator are un singur profil extins
User.hasOne(UserProfile, { foreignKey: "userId", as: "profile" });
UserProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

// ─── MANY-TO-ONE (hasMany / belongsTo) ──────────────────────────────────────
// Un capitol are multe întrebări; o întrebare aparține unui capitol
Chapter.hasMany(Question, { foreignKey: "chapterId", as: "questions" });
Question.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

// Un utilizator are multe tentative de quiz
User.hasMany(QuizAttempt, { foreignKey: "userId", as: "quizAttempts" });
QuizAttempt.belongsTo(User, { foreignKey: "userId", as: "user" });

// O tentativă de quiz aparține unui capitol
Chapter.hasMany(QuizAttempt, { foreignKey: "chapterId", as: "attempts" });
QuizAttempt.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

// Un utilizator are multe premii (many awards → one user)
User.hasMany(Award, { foreignKey: "userId", as: "awards" });
Award.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, UserProfile, Chapter, Question, QuizAttempt, Award, Task };