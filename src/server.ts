import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { AddressInfo } from 'node:net';

console.log('[DEBUG] Passo 1: O ficheiro server.ts começou a ser executado.');

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

console.log('[DEBUG] Passo 2: A configuração do Express foi concluída.');

if (isMainModule(import.meta.url)) {
  console.log('[DEBUG] Passo 3: A entrar no bloco principal para iniciar o servidor.');

  const port = Number(process.env['PORT']) || 4000;
  console.log(`[DEBUG] Passo 4: A tentar iniciar o servidor na porta ${port} e no host 0.0.0.0.`);

  const server = app.listen(port, '0.0.0.0', (error?: Error) => {
    if (error) {
      console.error('[DEBUG] ERRO CRÍTICO AO INICIAR O SERVIDOR:', error);
      throw error;
    }

    const { address, port } = server.address() as AddressInfo;
    console.log(`[SUCESSO] O servidor está a ouvir em http://${address}:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
