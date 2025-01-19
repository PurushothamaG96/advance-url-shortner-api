import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

enum nodeEnv {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}

const isProductCompile = process.env.NODE_ENV === nodeEnv.PRODUCTION;
const credentialsLocal = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "shortener",
};

const url = {
  url: process.env.DB_URL,
};

const source = {
  entities: [
    __dirname + isProductCompile ? "dist/entities/*.js" : "../../entities/*.ts",
  ],
  migrations: [
    __dirname + isProductCompile
      ? "dist/migrations/*.js"
      : "/../migrations/*.ts",
  ],
};

const AppDataSource = new DataSource({
  type: "postgres",
  ...(isProductCompile ? url : credentialsLocal),
  ...source,
  subscribers: [],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
