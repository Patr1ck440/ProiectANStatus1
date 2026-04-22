// app/src/stores/apiService.js
// Serviciu centralizat pentru toate apelurile API către backend

const BASE_URL = "http://localhost:3000/api";

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ─── USERS ────────────────────────────────────────────────────────────────────
export const userApi = {
  getAll: () => request("GET", "/users"),
  getById: (id) => request("GET", `/users/${id}`),
  getAttempts: (id) => request("GET", `/users/${id}/attempts`),
  getAwards: (id) => request("GET", `/users/${id}/awards`),
  getScoreboard: () => request("GET", "/users/scoreboard/top"),
  create: (data) => request("POST", "/users", data),
  login: (data) => request("POST", "/users/login", data),
  addPoints: (id, points) => request("POST", `/users/${id}/points`, { points }),
  update: (id, data) => request("PUT", `/users/${id}`, data),
  updateProfile: (id, data) => request("PUT", `/users/${id}/profile`, data),
  delete: (id) => request("DELETE", `/users/${id}`),
};

// ─── CHAPTERS ─────────────────────────────────────────────────────────────────
export const chapterApi = {
  getAll: () => request("GET", "/chapters"),
  getPublished: () => request("GET", "/chapters/published/list"),
  getById: (id) => request("GET", `/chapters/${id}`),
  getQuestions: (id) => request("GET", `/chapters/${id}/questions`),
  getStats: (id) => request("GET", `/chapters/${id}/stats`),
  create: (data) => request("POST", "/chapters", data),
  addQuestion: (id, data) => request("POST", `/chapters/${id}/questions`, data),
  publish: (id) => request("POST", `/chapters/${id}/publish`),
  update: (id, data) => request("PUT", `/chapters/${id}`, data),
  updateQuestion: (chapterId, qId, data) =>
    request("PUT", `/chapters/${chapterId}/questions/${qId}`, data),
  delete: (id) => request("DELETE", `/chapters/${id}`),
  deleteQuestion: (chapterId, qId) =>
    request("DELETE", `/chapters/${chapterId}/questions/${qId}`),
};

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
export const quizApi = {
  getAll: () => request("GET", "/quiz"),
  getById: (id) => request("GET", `/quiz/${id}`),
  getByUser: (userId) => request("GET", `/quiz/user/${userId}`),
  getBestByUser: (userId) => request("GET", `/quiz/user/${userId}/best`),
  getLeaderboard: () => request("GET", "/quiz/leaderboard/global"),
  submit: (data) => request("POST", "/quiz", data),
  checkAnswer: (questionId, answer) =>
    request("POST", "/quiz/check-answer", { questionId, answer }),
  addAward: (data) => request("POST", "/quiz/awards", data),
  updateAttempt: (id, data) => request("PUT", `/quiz/${id}`, data),
  updateAward: (id, data) => request("PUT", `/quiz/awards/${id}`, data),
  deleteAttempt: (id) => request("DELETE", `/quiz/${id}`),
  deleteUserAttempts: (userId) => request("DELETE", `/quiz/user/${userId}/all`),
};