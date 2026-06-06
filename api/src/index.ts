import { serve } from '@hono/node-server';

import app from './app.js';
import { closeDb } from './db/index.js';
import { env } from './config.js';

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
  },
);

const shutdown = async (): Promise<void> => {
  await closeDb();
  server.close();
};

process.once('SIGINT', () => {
  void shutdown();
});

process.once('SIGTERM', () => {
  void shutdown();
});
