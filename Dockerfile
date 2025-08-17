# syntax=docker.io/docker/dockerfile:1.7.1

ARG NODE_IMAGE_URL=${NODE_IMAGE_URL:-docker.io/node}
ARG NODE_IMAGE_VERSION=${NODE_IMAGE_VERSION:-22.18.0-bookworm-slim}

ARG ORG_OPENCONTAINERS_IMAGE_AUTHORS=${ORG_OPENCONTAINERS_IMAGE_AUTHORS:-}
ARG ORG_OPENCONTAINERS_IMAGE_BASE_DIGEST=${ORG_OPENCONTAINERS_IMAGE_BASE_DIGEST:-}
ARG ORG_OPENCONTAINERS_IMAGE_BASE_NAME=${ORG_OPENCONTAINERS_IMAGE_BASE_NAME:-}
ARG ORG_OPENCONTAINERS_IMAGE_CREATED=${ORG_OPENCONTAINERS_IMAGE_CREATED:-}
ARG ORG_OPENCONTAINERS_IMAGE_DESCRIPTION=${ORG_OPENCONTAINERS_IMAGE_DESCRIPTION:-}
ARG ORG_OPENCONTAINERS_IMAGE_DOCUMENTATION=${ORG_OPENCONTAINERS_IMAGE_DOCUMENTATION:-}
ARG ORG_OPENCONTAINERS_IMAGE_LICENSES=${ORG_OPENCONTAINERS_IMAGE_LICENSES:-}
ARG ORG_OPENCONTAINERS_IMAGE_REF_NAME=${ORG_OPENCONTAINERS_IMAGE_REF_NAME:-}
ARG ORG_OPENCONTAINERS_IMAGE_REVISION=${ORG_OPENCONTAINERS_IMAGE_REVISION:-}
ARG ORG_OPENCONTAINERS_IMAGE_SOURCE=${ORG_OPENCONTAINERS_IMAGE_SOURCE:-}
ARG ORG_OPENCONTAINERS_IMAGE_TITLE=${ORG_OPENCONTAINERS_IMAGE_TITLE:-}
ARG ORG_OPENCONTAINERS_IMAGE_URL=${ORG_OPENCONTAINERS_IMAGE_URL:-}
ARG ORG_OPENCONTAINERS_IMAGE_VENDOR=${ORG_OPENCONTAINERS_IMAGE_VENDOR:-}
ARG ORG_OPENCONTAINERS_IMAGE_VERSION=${ORG_OPENCONTAINERS_IMAGE_VERSION:-}

ARG CLIENT_REDIS_HOST=${CLIENT_REDIS_HOST:-redis}
ARG CLIENT_REDIS_PORT=${CLIENT_REDIS_PORT:-6379}
ARG CLIENT_SQLITE_FILENAME=${CLIENT_SQLITE_FILENAME:-./db.sqlite}
ARG SERVER_ACCOUNT_CACHE_TTL_MS=${SERVER_ACCOUNT_CACHE_TTL_MS:-30000}
ARG SERVER_GROUP_CACHE_TTL_MS=${SERVER_GROUP_CACHE_TTL_MS:-30000}
ARG SERVER_PERSON_CACHE_TTL_MS=${SERVER_PERSON_CACHE_TTL_MS:-30000}
ARG SERVER_TODO_CACHE_TTL_MS=${SERVER_TODO_CACHE_TTL_MS:-30000}
ARG SERVER_USER_CACHE_TTL_MS=${SERVER_USER_CACHE_TTL_MS:-30000}

FROM node:22.18.0-bookworm-slim AS deps
RUN mkdir -p /app && corepack enable
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY packages/domain/package.json ./packages/domain/
COPY packages/server/package.json ./packages/server/
COPY packages/cli/package.json ./packages/cli/
COPY patches/ ./patches
RUN pnpm i --frozen-lockfile

FROM node:22.18.0-bookworm-slim AS deps-prod
RUN mkdir -p /app && corepack enable
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY packages/domain/package.json ./packages/domain/
COPY packages/server/package.json ./packages/server/
COPY packages/cli/package.json ./packages/cli/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --from=deps /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=deps /app/packages/cli/node_modules ./packages/cli/node_modules
RUN pnpm prune --prod

FROM node:22.18.0-bookworm-slim AS build
RUN mkdir -p /app && corepack enable
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --from=deps /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=deps /app/packages/cli/node_modules ./packages/cli/node_modules
RUN pnpm run build

FROM node:22.18.0-bookworm-slim AS server

ARG ORG_OPENCONTAINERS_IMAGE_AUTHORS
ARG ORG_OPENCONTAINERS_IMAGE_BASE_DIGEST
ARG ORG_OPENCONTAINERS_IMAGE_BASE_NAME
ARG ORG_OPENCONTAINERS_IMAGE_CREATED
ARG ORG_OPENCONTAINERS_IMAGE_DESCRIPTION
ARG ORG_OPENCONTAINERS_IMAGE_DOCUMENTATION
ARG ORG_OPENCONTAINERS_IMAGE_LICENSES
ARG ORG_OPENCONTAINERS_IMAGE_REF_NAME
ARG ORG_OPENCONTAINERS_IMAGE_REVISION
ARG ORG_OPENCONTAINERS_IMAGE_SOURCE
ARG ORG_OPENCONTAINERS_IMAGE_TITLE
ARG ORG_OPENCONTAINERS_IMAGE_URL
ARG ORG_OPENCONTAINERS_IMAGE_VENDOR
ARG ORG_OPENCONTAINERS_IMAGE_VERSION

ARG CLIENT_REDIS_HOST
ARG CLIENT_REDIS_PORT
ARG CLIENT_SQLITE_FILENAME
ARG SERVER_ACCOUNT_CACHE_TTL_MS
ARG SERVER_GROUP_CACHE_TTL_MS
ARG SERVER_PERSON_CACHE_TTL_MS
ARG SERVER_TODO_CACHE_TTL_MS
ARG SERVER_USER_CACHE_TTL_MS

LABEL org.opencontainers.image.authors=${ORG_OPENCONTAINERS_IMAGE_AUTHORS}
LABEL org.opencontainers.image.base.digest=${ORG_OPENCONTAINERS_IMAGE_BASE_DIGEST}
LABEL org.opencontainers.image.base.name=${ORG_OPENCONTAINERS_IMAGE_BASE_NAME}
LABEL org.opencontainers.image.created=${ORG_OPENCONTAINERS_IMAGE_CREATED}
LABEL org.opencontainers.image.description=${ORG_OPENCONTAINERS_IMAGE_DESCRIPTION}
LABEL org.opencontainers.image.documentation=${ORG_OPENCONTAINERS_IMAGE_DOCUMENTATION}
LABEL org.opencontainers.image.licenses=${ORG_OPENCONTAINERS_IMAGE_LICENSES}
LABEL org.opencontainers.image.ref.name=${ORG_OPENCONTAINERS_IMAGE_REF_NAME}
LABEL org.opencontainers.image.revision=${ORG_OPENCONTAINERS_IMAGE_REVISION}
LABEL org.opencontainers.image.source=${ORG_OPENCONTAINERS_IMAGE_SOURCE}
LABEL org.opencontainers.image.title=${ORG_OPENCONTAINERS_IMAGE_TITLE}
LABEL org.opencontainers.image.url=${ORG_OPENCONTAINERS_IMAGE_URL}
LABEL org.opencontainers.image.vendor=${ORG_OPENCONTAINERS_IMAGE_VENDOR}
LABEL org.opencontainers.image.version=${ORG_OPENCONTAINERS_IMAGE_VERSION}

ENV CLIENT_REDIS_HOST=${CLIENT_REDIS_HOST}
ENV CLIENT_REDIS_PORT=${CLIENT_REDIS_PORT}
ENV CLIENT_SQLITE_FILENAME=${CLIENT_SQLITE_FILENAME}
ENV SERVER_ACCOUNT_CACHE_TTL_MS=${SERVER_ACCOUNT_CACHE_TTL_MS}
ENV SERVER_GROUP_CACHE_TTL_MS=${SERVER_GROUP_CACHE_TTL_MS}
ENV SERVER_PERSON_CACHE_TTL_MS=${SERVER_PERSON_CACHE_TTL_MS}
ENV SERVER_TODO_CACHE_TTL_MS=${SERVER_TODO_CACHE_TTL_MS}
ENV SERVER_USER_CACHE_TTL_MS=${SERVER_USER_CACHE_TTL_MS}

WORKDIR /app
ENV NODE_ENV=production
# ENV TINI_VERSION=v0.19.0
# ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
# RUN chmod +x /tini
# ENTRYPOINT ["/tini", "--"]
RUN export DEBIAN_FRONTEND=noninteractive \
  && apt update \
  && apt --yes upgrade \
  && apt --yes install --no-install-recommends \
    wget \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app && chown node:node /app
COPY --chown=node:node package.json .
COPY --chown=node:node pnpm-lock.yaml .
COPY --chown=node:node pnpm-workspace.yaml .
COPY --chown=node:node packages/domain/package.json ./packages/domain/
COPY --chown=node:node packages/server/package.json ./packages/server/
COPY --chown=node:node --from=deps-prod /app/node_modules ./node_modules
COPY --chown=node:node --from=deps-prod /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --chown=node:node --from=deps-prod /app/packages/server/node_modules ./packages/server/node_modules
COPY --chown=node:node --from=build /app/packages/domain/dist ./packages/domain/dist
COPY --chown=node:node --from=build /app/packages/server/dist ./packages/server/dist
USER node
EXPOSE 3001
CMD [ "node", "packages/server/dist/dist/esm/server.js" ]

FROM node:22.18.0-bookworm-slim AS cli

ARG ORG_OPENCONTAINERS_IMAGE_AUTHORS
ARG ORG_OPENCONTAINERS_IMAGE_BASE_DIGEST
ARG ORG_OPENCONTAINERS_IMAGE_BASE_NAME
ARG ORG_OPENCONTAINERS_IMAGE_CREATED
ARG ORG_OPENCONTAINERS_IMAGE_DESCRIPTION
ARG ORG_OPENCONTAINERS_IMAGE_DOCUMENTATION
ARG ORG_OPENCONTAINERS_IMAGE_LICENSES
ARG ORG_OPENCONTAINERS_IMAGE_REF_NAME
ARG ORG_OPENCONTAINERS_IMAGE_REVISION
ARG ORG_OPENCONTAINERS_IMAGE_SOURCE
ARG ORG_OPENCONTAINERS_IMAGE_TITLE
ARG ORG_OPENCONTAINERS_IMAGE_URL
ARG ORG_OPENCONTAINERS_IMAGE_VENDOR
ARG ORG_OPENCONTAINERS_IMAGE_VERSION

LABEL org.opencontainers.image.authors=${ORG_OPENCONTAINERS_IMAGE_AUTHORS}
LABEL org.opencontainers.image.base.digest=${ORG_OPENCONTAINERS_IMAGE_BASE_DIGEST}
LABEL org.opencontainers.image.base.name=${ORG_OPENCONTAINERS_IMAGE_BASE_NAME}
LABEL org.opencontainers.image.created=${ORG_OPENCONTAINERS_IMAGE_CREATED}
LABEL org.opencontainers.image.description=${ORG_OPENCONTAINERS_IMAGE_DESCRIPTION}
LABEL org.opencontainers.image.documentation=${ORG_OPENCONTAINERS_IMAGE_DOCUMENTATION}
LABEL org.opencontainers.image.licenses=${ORG_OPENCONTAINERS_IMAGE_LICENSES}
LABEL org.opencontainers.image.ref.name=${ORG_OPENCONTAINERS_IMAGE_REF_NAME}
LABEL org.opencontainers.image.revision=${ORG_OPENCONTAINERS_IMAGE_REVISION}
LABEL org.opencontainers.image.source=${ORG_OPENCONTAINERS_IMAGE_SOURCE}
LABEL org.opencontainers.image.title=${ORG_OPENCONTAINERS_IMAGE_TITLE}
LABEL org.opencontainers.image.url=${ORG_OPENCONTAINERS_IMAGE_URL}
LABEL org.opencontainers.image.vendor=${ORG_OPENCONTAINERS_IMAGE_VENDOR}
LABEL org.opencontainers.image.version=${ORG_OPENCONTAINERS_IMAGE_VERSION}

WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app && chown node:node /app
COPY --chown=node:node --from=deps-prod /app/node_modules ./node_modules
COPY --chown=node:node --from=deps-prod /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --chown=node:node --from=deps-prod /app/packages/cli/node_modules ./packages/cli/node_modules
COPY --chown=node:node --from=build /app/packages/domain/dist ./packages/domain/dist
COPY --chown=node:node --from=build /app/packages/cli/dist ./packages/cli/dist
USER node
ENTRYPOINT [ "node", "packages/cli/dist/dist/esm/bin.js" ]
