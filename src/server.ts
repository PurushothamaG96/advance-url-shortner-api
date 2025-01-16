import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/url.routes";
import AppDataSource from "./config/database";
import { setupUrlSwagger } from "./swagger/swagger-docs/short-swagger";

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

setupUrlSwagger(app);
app.use("/auth", authRoutes);

app.use("/api", urlRoutes);

const PORT = process.env.PORT || 3000;

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
