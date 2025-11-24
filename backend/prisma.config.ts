import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();
declare const process: {
  env: { [key: string]: string | undefined };
};

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "Missing DATABASE_URL environment variable. Add it to your .env or environment."
  );
}

export default defineConfig({
  schema: "./prisma/schema.prisma",

  datasource: {
    url: DATABASE_URL,
  },

  migrations: {
    path: "./prisma/migrations",
  },
});
