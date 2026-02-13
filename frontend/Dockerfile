FROM node:20.12.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Use Render environment variable if available, else default to production backend with /api
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-https://todos-api-2ott.onrender.com/api}

RUN npm run build

FROM node:20.12.0

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
