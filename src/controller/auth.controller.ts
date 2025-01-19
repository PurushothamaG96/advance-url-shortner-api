// import { Request, Response } from "express";
// import AppDataSource from "../config/database";
// import { User } from "../entities/users.entity";
// import { loginUser, registerUser } from "../service/auth-service";
// import redis from "../config/redis";

// export const registerController = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     res.status(400).json({ message: "Email and password are required" });
//   } else {
//     try {
//       // Register user in Firebase
//       const firebaseUser = await registerUser(email, password);

//       // Save the user in the database
//       const userRepository = AppDataSource.getRepository(User);
//       const user = userRepository.create({
//         googleId: firebaseUser.user.uid,
//         email,
//         name: firebaseUser.user.displayName || email.split("@")[0],
//         profileUrl: firebaseUser.user.photoURL || null,
//       });
//       await userRepository.save(user);

//       res
//         .status(201)
//         .json({ message: "User registered successfully", email: user.email });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error registering user", error: error });
//     }
//   }
// };

// export const loginController = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   // Check for missing email or password
//   if (!email || !password) {
//     res.status(400).json({ message: "Email and password are required" });
//   } else {
//     try {
//       // Authenticate user with Firebase
//       const firebaseUser = await loginUser(email, password);

//       if (!firebaseUser) {
//         throw new Error("Invalid credentials");
//       }

//       const accessToken = await firebaseUser.user.getIdToken();

//       const userRepository = AppDataSource.getRepository(User);

//       // Check if the user already exists in the database
//       let user = await userRepository.findOneBy({
//         googleId: firebaseUser.user.uid,
//       });

//       if (!user) {
//         // If not, create a new user in the database
//         user = userRepository.create({
//           googleId: firebaseUser.user.uid,
//           email: firebaseUser.user.email!,
//           name: firebaseUser.user.displayName || email.split("@")[0],
//           profileUrl: firebaseUser.user.photoURL || null,
//         });
//         await userRepository.save(user);
//       }

//       const userData = {
//         user: {
//           email: user.email,
//           name: user.name,
//           profileUrl: user.profileUrl,
//         },
//         refreshToken: firebaseUser.user.refreshToken,
//         accessToken,
//       };

//       // Save the access token in Redis
//       await redis.set(accessToken, user.id, "EX", 3600);

//       // Respond with a success message
//       res.status(200).json({
//         message: "User logged in successfully",
//         userData,
//       });
//     } catch (error: any) {
//       console.error(error);
//       res.status(500).json({
//         message: "Error logging in user",
//         error: error.message || error,
//       });
//     }
//   }
// };
