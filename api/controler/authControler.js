const USERNAME = "admin";
const PASSWORD = "admin";

export function authController(username, password) {
  if (username === USERNAME && password === PASSWORD) {
    return { success: true, message: "Login successful" };
  } else {
    return { success: false, message: "Login failed" };
  }
}
