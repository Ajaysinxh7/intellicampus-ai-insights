import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User"; // your mongoose model
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Case-insensitive email search
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log(`Login attempt failed: User not found for email: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`Login attempt for user: ${user.email}, role: ${user.role}`);
    console.log(`Password in DB starts with $2: ${user.password.startsWith("$2")}`);

    const isPasswordHashed = user.password.startsWith("$2");
    let isMatch = false;

    if (isPasswordHashed) {
      isMatch = await bcrypt.compare(password, user.password);
      console.log(`Bcrypt comparison result: ${isMatch}`);
    } else {
      // Plain text comparison
      isMatch = user.password === password;
      console.log(`Plain text comparison result: ${isMatch}`);
      console.log(`Stored password: "${user.password}", Provided password: "${password}"`);

      if (isMatch) {
        // Upgrade to hashed password
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        console.log("Password upgraded to bcrypt hash");
      }
    }

    if (!isMatch) {
      console.log(`Login failed: Password mismatch for user: ${user.email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    console.log(`Login successful for user: ${user.email}`);
    return res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
