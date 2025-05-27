import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied! Admin access required" });
    }

    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

// Convenience middleware for admin-only routes
export const requireAdmin = verifyAdmin;

// Convenience middleware for user-only routes
export const requireUser = verifyToken; // ADMIN can access user routes too 