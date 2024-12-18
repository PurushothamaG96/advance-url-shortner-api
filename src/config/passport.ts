import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../entities/user";
import { AppDataSource } from "./database";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const userRepository = AppDataSource.getRepository(User);
      let user = await userRepository.findOneBy({ googleId: profile.id });

      if (!user) {
        user = userRepository.create({
          googleId: profile.id,
          email: profile.emails?.[0].value,
          name: profile.displayName,
        });
        await userRepository.save(user);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, id));

export default passport;
