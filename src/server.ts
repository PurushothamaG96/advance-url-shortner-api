import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/url.routes";
import AppDataSource from "./config/database";
import { setupUrlSwagger } from "./swagger/swagger-docs/short-swagger";
import connectDatabase from "./config/mongo";

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

// const client = new Client({
//   connectionString:
//     "postgresql://shortner_9cxs_user:CMErRtPlXHYbgbnk8hjkEWd2qidSqDtU@dpg-ctjeu80gph6c738gko60-a.oregon-postgres.render.com/shortner_9cxs",
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

setupUrlSwagger(app);
app.use("/auth", authRoutes);

app.use("/api", urlRoutes);

const PORT = process.env.PORT;

// Initialize the database and start the server

app.listen(PORT, () => {
  console.log(`APP listening on port ${PORT}`);
});
