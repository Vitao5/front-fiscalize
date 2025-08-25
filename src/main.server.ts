import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { AppServerModule } from './app/app.server.module';
import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { join } from 'path';

const app = express();
const distFolder = join(process.cwd(), 'dist/front-fiscalize/browser');
const indexHtml = 'index';

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModule,
  })
);

app.set('view engine', 'html');
app.set('views', distFolder);

app.get('*.*', express.static(distFolder, { maxAge: '1y' }));

app.get('*', (req: express.Request, res: express.Response) => {
  res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
});

const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
