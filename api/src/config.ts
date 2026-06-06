import "dotenv/config";

const readEnvOrDefault = (name: string, defaultValue: string): string => {
  return process.env[name] ?? defaultValue;
};

const getDatabaseUrl = (): string => {
  const providedUrl = process.env.DATABASE_URL;
  if (providedUrl) {
    return providedUrl;
  }

  const host = readEnvOrDefault("DB_HOST", "localhost");
  const port = readEnvOrDefault("DB_PORT", "5432");
  const user = readEnvOrDefault("DB_USER", "postgres");
  const password = readEnvOrDefault("DB_PASSWORD", "");
  const database = readEnvOrDefault("DB_NAME", "postgres");

  if (!password) {
    throw new Error("DB_PASSWORD environment variable is required");
  }

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

export const env = {
  DATABASE_URL: getDatabaseUrl(),
  PORT: Number(process.env.PORT ?? "3000"),
  DB_HOST: readEnvOrDefault("DB_HOST", "localhost"),
  DB_PORT: Number(process.env.DB_PORT ?? "5432"),
  DB_USER: readEnvOrDefault("DB_USER", "postgres"),
  DB_PASSWORD: readEnvOrDefault("DB_PASSWORD", ""),
  DB_NAME: readEnvOrDefault("DB_NAME", "postgres"),
};
