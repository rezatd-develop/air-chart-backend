import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        if (req.path.startsWith("/api/auth")) {
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, 'supersecretkey');
        req.user = decoded;

        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
