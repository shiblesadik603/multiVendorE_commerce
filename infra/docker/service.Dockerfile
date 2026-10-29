# One Dockerfile for every service. Build context = repository root (services share packages/common).
#   docker build -f infra/docker/service.Dockerfile --build-arg SERVICE=auth-service --build-arg PORT=4001 .
FROM node:20-alpine
ARG SERVICE
ARG PORT=4000
ENV SERVICE=$SERVICE PORT=$PORT NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages ./packages
COPY services ./services
# Dev dependencies are needed to compile TypeScript; they are pruned afterwards.
RUN NODE_ENV=development npm ci \
 && npm run build -w @marketplace/common \
 && (if [ -d services/$SERVICE/prisma ]; then npx prisma generate --schema services/$SERVICE/prisma/schema.prisma; fi) \
 && npm run build -w $SERVICE \
 && npm prune --omit=dev
USER node
EXPOSE $PORT
WORKDIR /app/services/$SERVICE
# Services with a database apply pending migrations on start, then run.
CMD ["sh", "-c", "if [ -d prisma ]; then npx prisma migrate deploy; fi && node dist/server.js"]
