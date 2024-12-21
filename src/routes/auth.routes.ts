import { Router } from "express";
import passport from "passport";

const router = Router();

// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect("/auth/success");
  }
);

// Successful login
router.get("/success", (req, res) => {
  console.log(req.user);
  res.send("Google Authentication Successful! Welcome, " + req.user);
});

// Failed login
router.get("/failure", (req, res) => {
  res.send("Failed to authenticate.");
});

export default router;
