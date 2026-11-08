import { createServer } from 'node:http';
import app from './app.js';
import { attachSockets } from './sockets/index.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

const httpServer = createServer(app);
attachSockets(httpServer);

try {
  await connectDatabase();
  httpServer.listen(env.port, () => console.log(`[server] listening on ${env.port}`));
} catch (error) {
  console.error('[server] startup failed', error);
  process.exit(1);
}

// TODO: Add graceful shutdown for HTTP, Socket.IO and MongoDB.
