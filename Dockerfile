# syntax=docker.io/docker/dockerfile:1.7.1

ARG NODE_IMAGE_URL=${NODE_IMAGE_URL:-docker.io/node}
ARG NODE_IMAGE_VERSION=${NODE_IMAGE_VERSION:-22.20.0-bookworm-slim}

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

ARG BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-better-auth-secret-123456789-00000000-0000-0000-0000-000000000000}
ARG BETTER_AUTH_URL=${BETTER_AUTH_URL:-http://127.0.0.1:3001}
ARG RESEND_API_KEY=${RESEND_API_KEY:-re_xxxxxxxxx}
ARG RESEND_FROM_EMAIL=${RESEND_FROM_EMAIL:-smhmayboudi@gmail.com}
ARG RUNNER_SHARD_RUNNER_ADDRESS_HOST=${RUNNER_SHARD_RUNNER_ADDRESS_HOST:-127.0.0.1}
ARG RUNNER_SHARD_RUNNER_ADDRESS_PORT=${RUNNER_SHARD_RUNNER_ADDRESS_PORT:-8088}
ARG RUNNER_SHARD_MANAGER_ADDRESS_HOST=${RUNNER_SHARD_MANAGER_ADDRESS_HOST:-127.0.0.1}
ARG RUNNER_SHARD_MANAGER_ADDRESS_PORT=${RUNNER_SHARD_MANAGER_ADDRESS_PORT:-8080}
ARG RUNNER_SQLITE_FILENAME=${RUNNER_SQLITE_FILENAME:-./db-workflow.sqlite}
ARG SERVER_ELASTICSEARCH_NODE=${SERVER_ELASTICSEARCH_NODE:-http://127.0.0.1:9200}
ARG SERVER_REDIS_HOST=${SERVER_REDIS_HOST:-127.0.0.1}
ARG SERVER_REDIS_PORT=${SERVER_REDIS_PORT:-6379}
ARG SERVER_SQLITE_FILENAME=${SERVER_SQLITE_FILENAME:-./db-server.sqlite}
ARG SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_HOST=${SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_HOST:-127.0.0.1}
ARG SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_PORT=${SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_PORT:-8080}
ARG SERVER_WORKFLOW_SQLITE_FILENAME=${SERVER_WORKFLOW_SQLITE_FILENAME:-./db-workflow.sqlite}
ARG SERVER_GROUP_CACHE_TTL_MS=${SERVER_GROUP_CACHE_TTL_MS:-30000}
ARG SERVER_PERSON_CACHE_TTL_MS=${SERVER_PERSON_CACHE_TTL_MS:-30000}
ARG SERVER_SERVICE_CACHE_TTL_MS=${SERVER_SERVICE_CACHE_TTL_MS:-30000}
ARG SERVER_TODO_CACHE_TTL_MS=${SERVER_TODO_CACHE_TTL_MS:-30000}
ARG SHARD_MANAGER_SHARD_MANAGER_ADDRESS_HOST=${SHARD_MANAGER_SHARD_MANAGER_ADDRESS_HOST:-127.0.0.1}
ARG SHARD_MANAGER_SHARD_MANAGER_ADDRESS_PORT=${SHARD_MANAGER_SHARD_MANAGER_ADDRESS_PORT:-8080}
ARG SHARD_MANAGER_SQLITE_FILENAME=${SHARD_MANAGER_SQLITE_FILENAME:-./db-workflow.sqlite}

FROM ${NODE_IMAGE_URL}:${NODE_IMAGE_VERSION} AS base
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


FROM base AS deps
RUN mkdir -p /app && corepack enable
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY packages/cli/package.json ./packages/cli/
COPY packages/domain/package.json ./packages/domain/
COPY packages/runner/package.json ./packages/runner/
COPY packages/server/package.json ./packages/server/
COPY packages/shard-manager/package.json ./packages/shard-manager/
COPY patches/ ./patches
RUN pnpm i --frozen-lockfile

FROM base AS deps-prod
RUN mkdir -p /app && corepack enable
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY packages/cli/package.json ./packages/cli/
COPY packages/domain/package.json ./packages/domain/
COPY packages/runner/package.json ./packages/runner/
COPY packages/server/package.json ./packages/server/
COPY packages/shard-manager/package.json ./packages/shard-manager/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/cli/node_modules ./packages/cli/node_modules
COPY --from=deps /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --from=deps /app/packages/runner/node_modules ./packages/runner/node_modules
COPY --from=deps /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=deps /app/packages/shard-manager/node_modules ./packages/shard-manager/node_modules
RUN pnpm prune --prod

FROM base AS build
RUN mkdir -p /app && corepack enable
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/cli/node_modules ./packages/cli/node_modules
COPY --from=deps /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --from=deps /app/packages/runner/node_modules ./packages/runner/node_modules
COPY --from=deps /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=deps /app/packages/shard-manager/node_modules ./packages/shard-manager/node_modules
RUN pnpm run build

FROM base AS cli
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app && chown node:node /app
COPY --chown=node:node --from=deps-prod /app/node_modules ./node_modules
COPY --chown=node:node --from=deps-prod /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --chown=node:node --from=deps-prod /app/packages/cli/node_modules ./packages/cli/node_modules
COPY --chown=node:node --from=build /app/packages/domain/dist ./packages/domain/dist
COPY --chown=node:node --from=build /app/packages/cli/dist ./packages/cli/dist
USER node
ENTRYPOINT [ "node", "packages/cli/dist/dist/esm/Bin.js" ]

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app && chown node:node /app
COPY --chown=node:node --from=deps-prod /app/node_modules ./node_modules
COPY --chown=node:node --from=deps-prod /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --chown=node:node --from=deps-prod /app/packages/runner/node_modules ./packages/runner/node_modules
COPY --chown=node:node --from=build /app/packages/domain/dist ./packages/domain/dist
COPY --chown=node:node --from=build /app/packages/runner/dist ./packages/runner/dist
USER node
ENTRYPOINT [ "node", "packages/runner/dist/dist/esm/Runner.js" ]

FROM base AS server
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG RESEND_API_KEY
ARG RESEND_FROM_EMAIL
ARG SERVER_ELASTICSEARCH_NODE
ARG SERVER_REDIS_HOST
ARG SERVER_REDIS_PORT
ARG SERVER_SQLITE_FILENAME
ARG SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_HOST
ARG SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_PORT
ARG SERVER_WORKFLOW_SQLITE_FILENAME
ARG SERVER_GROUP_CACHE_TTL_MS
ARG SERVER_PERSON_CACHE_TTL_MS
ARG SERVER_SERVICE_CACHE_TTL_MS
ARG SERVER_TODO_CACHE_TTL_MS
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV RESEND_FROM_EMAIL=${RESEND_FROM_EMAIL}
ENV SERVER_ELASTICSEARCH_NODE=${SERVER_ELASTICSEARCH_NODE}
ENV SERVER_REDIS_HOST=${SERVER_REDIS_HOST}
ENV SERVER_REDIS_PORT=${SERVER_REDIS_PORT}
ENV SERVER_SQLITE_FILENAME=${SERVER_SQLITE_FILENAME}
ENV SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_HOST=${SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_HOST}
ENV SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_PORT=${SERVER_WORKFLOW_SHARD_MANAGER_ADDRESS_PORT}
ENV SERVER_WORKFLOW_SQLITE_FILENAME=${SERVER_WORKFLOW_SQLITE_FILENAME}
ENV SERVER_GROUP_CACHE_TTL_MS=${SERVER_GROUP_CACHE_TTL_MS}
ENV SERVER_PERSON_CACHE_TTL_MS=${SERVER_PERSON_CACHE_TTL_MS}
ENV SERVER_SERVICE_CACHE_TTL_MS=${SERVER_SERVICE_CACHE_TTL_MS}
ENV SERVER_TODO_CACHE_TTL_MS=${SERVER_TODO_CACHE_TTL_MS}
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
CMD [ "node", "packages/server/dist/dist/esm/Server.js" ]

FROM base AS shard-manager
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app && chown node:node /app
COPY --chown=node:node --from=deps-prod /app/node_modules ./node_modules
COPY --chown=node:node --from=deps-prod /app/packages/domain/node_modules ./packages/domain/node_modules
COPY --chown=node:node --from=deps-prod /app/packages/shard-manager/node_modules ./packages/shard-manager/node_modules
COPY --chown=node:node --from=build /app/packages/domain/dist ./packages/domain/dist
COPY --chown=node:node --from=build /app/packages/shard-manager/dist ./packages/shard-manager/dist
USER node
ENTRYPOINT [ "node", "packages/shard-manager/dist/dist/esm/ShardManager.js" ]
