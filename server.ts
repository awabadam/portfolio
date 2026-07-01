import { createServer } from 'http';
import next from 'next';
import { WebSocketServer } from 'ws';
import { handleWebSocketConnection } from './src/lib/chat/websocketHandler';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';

// Support `--port <n>` / `-p <n>` / `--port=<n>` on the CLI (e.g.
// `npm run dev -- --port 5000`), falling back to the PORT env var, then 3000.
function resolvePort(): number {
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--port' || arg === '-p') {
      const val = argv[i + 1];
      if (val) return parseInt(val, 10);
    } else if (arg.startsWith('--port=')) {
      return parseInt(arg.slice('--port='.length), 10);
    }
  }
  return parseInt(process.env.PORT || '3000', 10);
}

const port = resolvePort();

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Create WebSocket server (noServer mode to manually handle upgrades)
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws, req) => {
    handleWebSocketConnection(ws, req);
  });

  // Handle chat WebSocket before Next.js registers its own upgrade handler
  server.on('upgrade', (req, socket, head) => {
    if (req.url?.startsWith('/api/chat/ws')) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    }
    // Non-matching requests fall through to Next.js's own upgrade handler
  });

  server
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> WebSocket server ready on ws://${hostname}:${port}/api/chat/ws`);
    });
});
