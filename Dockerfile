FROM node:22-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  python3 \
  pkg-config \
  libprotobuf-dev \
  procps \
  ca-certificates && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json postinstall.mjs ./

RUN npm ci
RUN npm rebuild @tensorflow/tfjs-node --build-from-source

COPY . .

CMD ["npx", "pm2-runtime", "start", "ecosystem.config.js"]