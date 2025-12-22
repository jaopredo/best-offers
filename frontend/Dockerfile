# Instalando as dependências
FROM node:24-alpine AS base

ARG PORT=8000

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /usr/src/app

FROM base AS dependencies

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Buildando o projeto
FROM base AS build

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

RUN yarn build

# Rodando a aplicação
FROM base AS run

ENV NODE_ENV=production
ENV PORT=$PORT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=build /usr/src/app/public ./public
COPY --from=build --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs

EXPOSE $PORT

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
