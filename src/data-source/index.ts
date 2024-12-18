import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user";
import { Url } from "../entities/shortURL";
import { Analytics } from "../entities/analytics";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Url, Analytics],
  migrations: [],
  subscribers: [],
});
