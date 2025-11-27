import { Request, Response, NextFunction } from "express";
import User from "../models/User";

/**
 * Middleware to check if user has teacher or admin role
 */
export const requireTeacherOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    if (user.role !== "teacher" && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Teacher or Admin role required." });
    }

    // Attach user role to request for use in routes
    (req as any).userRole = user.role;
    next();
  } catch (error) {
    console.error("Role check error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

