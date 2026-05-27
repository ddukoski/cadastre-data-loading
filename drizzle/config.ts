import { config } from 'dotenv';

config();

const readEnvOrFail = (name: string): string => {
    const val = process.env[name];
    
    if (!val) {
        throw new Error(`Could not read environment variable ${name}`);
    }

    return val;
}

export default {
    DATABASE_URL: readEnvOrFail('DATABASE_URL'),
}