FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY . .

# Instala dependências e constrói a aplicação
RUN npm install
RUN npm run build:ssr:hml

# Estágio de execução
FROM node:20-alpine

WORKDIR /app

# Copia os artefatos de build e as dependências de produção
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Instala as dependências de execução
RUN npm ci --omit=dev

# Comando de inicialização correto
CMD ["node", "dist/front-fiscalize/server/server.mjs"]
