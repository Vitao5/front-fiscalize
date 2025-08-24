FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
COPY . .

# Instala dependências e constrói a aplicação
RUN npm install
RUN npm run build:ssr:hml

# Estágio de execução
FROM node:20

WORKDIR /app

# Copia os artefatos de build e as dependências de produção
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Instala as dependências de execução
RUN npm ci --omit=dev

# Comando de inicialização
CMD ["ls", "-la", "/app/dist/front-fiscalize/"]
