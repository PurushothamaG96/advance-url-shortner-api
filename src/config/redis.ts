import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: "default",
  password: "UXDJXSe8421eUxWewvqn0GPjcKiLRtBq",
});

export default redis;
