// Script para injetar variáveis do .env.secret nos arquivos de ambiente Angular
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../src/environments/.env.secret');
const prodPath = path.resolve(__dirname, '../src/environments/environment.prod.ts');
const homologPath = path.resolve(__dirname, '../src/environments/environment.homolog.ts');

function parseEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...rest] = line.split('=');
      env[key.trim()] = rest.join('=').trim();
    }
  }
  return env;
}

function injectApiUrl(targetPath, apiUrl, prod = false, homolog = false) {
  let content = `export const environment = {\n`;
  content += `  production: ${prod},\n`;
  if (homolog) content += `  homolog: true,\n`;
  content += `  apiUrl: '${apiUrl}'\n`;
  content += `};\n`;
  fs.writeFileSync(targetPath, content, 'utf-8');
}

const envVars = parseEnv(envPath);
if (envVars.API_URL_PROD) {
  injectApiUrl(prodPath, envVars.API_URL_PROD, true, false);
}
if (envVars.API_URL_HOMOLOG) {
  injectApiUrl(homologPath, envVars.API_URL_HOMOLOG, false, true);
}
console.log('Variáveis de ambiente injetadas nos arquivos Angular!');
