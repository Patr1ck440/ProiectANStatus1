import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
  const token = authorizationHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
}

