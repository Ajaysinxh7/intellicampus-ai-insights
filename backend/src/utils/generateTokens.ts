    import jwt from "jsonwebtoken";

    export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.ACCESS_SECRET!, {
        expiresIn: "15m",
    });
    };

    export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.REFRESH_SECRET!, {
        expiresIn: "7d",
    });
    };
        