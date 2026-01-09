import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
export const requireAuth = authRequired;


// Middleware: cere token valid și pune userul în req.user
export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // {id,email,role,name}
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Middleware: cere un rol anume
export function requireRole(...roles) {
  return (req, res, next) => {
    const role = String(req.user?.role || "").toLowerCase();
    const ok = roles.map(r => String(r).toLowerCase()).includes(role);
    if (!ok) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

