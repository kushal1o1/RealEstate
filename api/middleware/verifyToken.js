import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
const token = req.cookies.token;

    if (!token) return res.status(401).json(
        {
        message:"Not authenticated!"
    });

    jwt.verify(token, process.env.JWT_SECRET_KEY,async (err, payload) => {
        if (err) return res.status(403).json(
            {
                message:"Token is not valid!"
            });
        req.userId = payload.id;
        req.isAdmin = payload.isAdmin;
        next();
    }
    );
}

// Middleware to check if user is admin
export const verifyAdmin = (req, res, next) => {
    console.log(req.isAdmin)
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Access denied! Admin access required" });
    }
    next();
}


