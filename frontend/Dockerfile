FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
FROM node:20-alpine AS runner
WORKDIR /app

# Define o ambiente para produção
ENV NODE_ENV=production

# Copia apenas os artefactos necessários do estágio de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
EXPOSE 3000
CMD ["yarn", "start"]