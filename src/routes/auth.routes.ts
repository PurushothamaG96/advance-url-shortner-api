import { Router } from "express";
import passport from "passport";
import { googleLoginSuccess, logout } from "../controller/auth.controller";

const router = Router();

// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/auth/success");
  }
);

// Successful login
router.get("/success", googleLoginSuccess);

// Logout
router.get("/logout", logout);

export default router;
