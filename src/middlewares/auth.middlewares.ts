import e, { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import redis from "../config/redis";
import { firebaseServiceConfigure } from "../config/firebase-service";
import User from "../schema/user";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    firebaseServiceConfigure as admin.ServiceAccount
  ),
});

// Extend the Request interface to include the `user` property
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

// Authentication middleware
export const authenticate = async (
  req: e.Request,
  res: e.Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Validate Authorization header
    if (!authHeader?.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    } else {
      // Extract the token
      const token = authHeader.split(" ")[1];

      // Verify token with Firebase Admin
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Check Redis for cached user ID
      let userId: any = await redis.get(token);
      req.user = JSON.parse(userId);

      if (!userId) {
        // Fetch the user from the database using Mongoose
        const user = await User.findOne({ email: decodedToken.email }).exec();

        if (!user) {
          res.status(404).json({ message: "User not found" });
        } else {
          // Cache user ID in Redis for subsequent requests
          userId = user._id!;
          await redis.set(token, JSON.stringify(userId), "EX", 3600);
        }

        // Attach user data to the request object
        req.user = user!._id!;
      }

      next();
    }
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
