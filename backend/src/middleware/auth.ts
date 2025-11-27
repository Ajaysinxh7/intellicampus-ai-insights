    import { Request, Response, NextFunction } from "express";
    import jwt from "jsonwebtoken";

    export const verifyAccessToken = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
        return res.status(403).json({ message: "Access denied" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
        (req as any).user = decoded;

        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
    };
