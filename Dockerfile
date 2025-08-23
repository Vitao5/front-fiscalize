# Imagem base
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
COPY . .

# Instala dependências
RUN npm install

# Build SSR (ajuste para prod ou homolog conforme necessário)
RUN npm run build:ssr

FROM node:20-alpine

WORKDIR /app


COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 8080

CMD ["node", "dist/front-fiscalize/server/server.mjs"]
