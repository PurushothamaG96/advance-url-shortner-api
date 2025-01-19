import { Request, Response } from "express";
import { loginUser, registerUser } from "../service/auth-service";
import redis from "../config/redis";
import User from "../schema/user";

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
  } else {
    try {
      // Register user in Firebase
      const firebaseUser = await registerUser(email, password);

      // Check if the user already exists in MongoDB
      const existingUser = await User.findOne({
        googleId: firebaseUser.user.uid,
      });
      if (existingUser) {
        res.status(409).json({ message: "User already exists" });
      } else {
        // Create and save the user in MongoDB
        const newUser = new User({
          googleId: firebaseUser.user.uid,
          email,
          name: firebaseUser.user.displayName || email.split("@")[0],
          profileUrl: firebaseUser.user.photoURL || null,
        });
        await newUser.save();

        res.status(201).json({
          message: "User registered successfully",
          email: newUser.email,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error registering user", error });
    }
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
  } else {
    try {
      // Authenticate user with Firebase
      const firebaseUser = await loginUser(email, password);

      if (!firebaseUser) {
        throw new Error("Invalid credentials");
      }

      const accessToken = await firebaseUser.user.getIdToken();

      // Find the user in MongoDB by Google UID
      let user = await User.findOne({ googleId: firebaseUser.user.uid });

      if (!user) {
        // If not found, create a new user in MongoDB
        user = new User({
          googleId: firebaseUser.user.uid,
          email: firebaseUser.user.email!,
          name: firebaseUser.user.displayName || email.split("@")[0],
          profileUrl: firebaseUser.user.photoURL || null,
        });
        await user.save();
      }

      const userData = {
        user: {
          email: user.email,
          name: user.name,
          profileUrl: user.profileUrl,
        },
        refreshToken: firebaseUser.user.refreshToken,
        accessToken,
      };

      // Save the access token in Redis
      await redis.set(accessToken, JSON.stringify(user._id!), "EX", 3600);

      res.status(200).json({
        message: "User logged in successfully",
        userData,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        message: "Error logging in user",
        error: error.message || error,
      });
    }
  }
};
