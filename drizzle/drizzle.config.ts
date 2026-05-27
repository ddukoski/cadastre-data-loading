import { defineConfig } from "drizzle-kit";
import config from './config';

const { DATABASE_URL: url } = config;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
