import {PrismaClient} from "@prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";
import {Pool} from "pg";

import dotenv from "dotenv";

dotenv.config();

// console.log(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "development"
      ? process.env.DATABASE_URL_DEV
      : process.env.DATABASE_URL_PROD,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});
