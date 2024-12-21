import express from "express";
import session from "express-session";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import AppDataSource from "./config/database";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Initialize the database and start the server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`APP listening on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Error during database initialization", error);
  });
