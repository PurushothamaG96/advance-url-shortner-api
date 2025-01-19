import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/url.routes";
import AppDataSource from "./config/database";
import { setupUrlSwagger } from "./swagger/swagger-docs/short-swagger";
import connectDatabase from "./config/mongo";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDatabase();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: "*", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    credentials: true,
  })
);

setupUrlSwagger(app);
app.use("/auth", authRoutes);

app.use("/api", urlRoutes);

const PORT = process.env.PORT;

// Initialize the database and start the server

app.listen(PORT, () => {
  console.log(`APP listening on port ${PORT}`);
});
