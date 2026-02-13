FROM node:20.12.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.12.0

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/serve.json ./serve.json

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
