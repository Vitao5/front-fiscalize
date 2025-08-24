import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { AddressInfo } from 'node:net';

// Recreate __dirname for CommonJS
const __dirname = path.dirname(__filename);

const browserDistFolder = path.join(__dirname, '..', 'browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Health check endpoint for Render
app.get('/healthz', (req: Request, res: Response) => {
  console.log('Health check endpoint accessed');
  res.status(200).send('OK');
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
});

// Start the server
const port = Number(process.env['PORT']) || 4000;

const server = app.listen(port, '0.0.0.0', (error?: Error) => {
  if (error) {
    console.error('Error starting server:', error);
    throw error;
  }
  const { address, port } = server.address() as AddressInfo;
  console.log(`Node Express server listening on http://${address}:${port}`);
});

server.on('error', (err: Error) => {
  console.error('Server error:', err);
});

export const reqHandler = createNodeRequestHandler(app);
