import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../entities/user";
import AppDataSource from "./database";

import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken);
      // check user by google id
      const userRepository = AppDataSource.getRepository(User);
      let user = await userRepository.findOneBy({ googleId: profile.id });

      // if not exist create new user
      if (!user) {
        user = userRepository.create({
          googleId: profile.id,
          email: profile.emails?.[0]?.value || "",
          name: profile.displayName || "",
          profileUrl: profile.photos?.[0]?.value || null,
        });
        await userRepository.save(user);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    done(null, user || null);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
