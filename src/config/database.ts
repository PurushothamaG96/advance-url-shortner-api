import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "shortener",
  entities: [__dirname + "../../entities/*.ts", "dist/entities/*.js"],
  migrations: [__dirname + "/../migrations/*.ts", "dist/migrations/*.js"],
  subscribers: [],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
