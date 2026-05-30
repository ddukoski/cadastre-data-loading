import 'dotenv/config';

const readEnvOrDefault = (name: string, def: string): string =>
    process.env[name] ?? def;

const getDatabaseUrl = (): string => {
    const provided = process.env['DATABASE_URL'];
    if (provided) return provided;

    const host = readEnvOrDefault('DB_HOST', 'localhost');
    const port = readEnvOrDefault('DB_PORT', '5432');
    const user = readEnvOrDefault('DB_USER', 'postgres');
    const password = process.env['DB_PASSWORD'] ?? '';
    const database = readEnvOrDefault('DB_NAME', 'postgres');

    if (!password) throw new Error('DB_PASSWORD environment variable is required');

    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

export default {
    DATABASE_URL: getDatabaseUrl(),
}