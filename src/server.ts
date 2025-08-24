import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { AddressInfo } from 'node:net';

console.log('[SERVER] Iniciando server.ts...');

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
  console.error('[SERVER] Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('[SERVER] Unhandled Rejection:', err);
});

if (isMainModule(import.meta.url)) {
  console.log('[SERVER] Executando como módulo principal.');

  const apiUrl = process.env['API_URL_HOMOLOG'] || process.env['API_URL_PROD'];
  console.log(`[SERVER] Lendo API_URL_HOMOLOG do ambiente: ${process.env['API_URL_HOMOLOG']}`);
  console.log(`[SERVER] URL final da API a ser usada: ${apiUrl}`);

  if (!apiUrl) {
    console.error('[SERVER] CRÍTICO: A variável de ambiente API_URL_HOMOLOG não está definida. Encerrando.');
    process.exit(1); // Força a saída com erro
  }

  const port = Number(process.env['PORT']) || 4000;
  console.log(`[SERVER] Tentando escutar na porta: ${port}`);

  const server = app.listen(port, '0.0.0.0', (error?: Error) => {
    if (error) {
      console.error('[SERVER] Erro ao iniciar o servidor:', error);
      throw error;
    }
    const { address, port } = server.address() as AddressInfo;
    console.log(`[SERVER] Servidor Node Express escutando em http://${address}:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);