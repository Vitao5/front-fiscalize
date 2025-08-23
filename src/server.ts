import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { AddressInfo } from 'node:net';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});
if (isMainModule(import.meta.url)) {

  const port = Number(process.env['PORT']) || 4000;

  const server = app.listen(port, '0.0.0.0', (error?: Error) => {
    if (error) {
      throw error;
    }
    const { address, port } = server.address() as AddressInfo;
    console.log(`Node Express server listening on http://${address}:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
