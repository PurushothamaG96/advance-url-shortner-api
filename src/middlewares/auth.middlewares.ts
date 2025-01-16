import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { User } from "../entities/users";
import AppDataSource from "../config/database";
import { firebaseServiceConfigure } from "../config/firebase-service";

admin.initializeApp({
  credential: admin.credential.cert(
    firebaseServiceConfigure as admin.ServiceAccount
  ),
});

// Extend the Request interface to include the `user` property
export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);
    if (!authHeader?.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    } else {
      const token = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email: decodedToken.email,
        },
      });

      if (!user) throw Error;

      req.user = user.id;
      next();
    }
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
