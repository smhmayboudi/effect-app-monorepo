import { HttpMiddleware, HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { NodeHttpServerRequest } from "@effect/platform-node"
import { toNodeHandler } from "better-auth/node"
import { Effect } from "effect"
import { auth } from "../infrastructure/adapter/Authentication/Authentication.js"

export const MiddlewareAuthenticationRoute = HttpMiddleware.make((app) =>
  HttpServerRequest.HttpServerRequest.pipe(Effect.flatMap((request) => {
    const nodeRequest = NodeHttpServerRequest.toIncomingMessage(request)
    const nodeResponse = NodeHttpServerRequest.toServerResponse(request)

    return (request.url.includes("/auth/") && (request.method === "GET" || request.method === "POST")) ?
      Effect.tryPromise(() => toNodeHandler(auth)(nodeRequest, nodeResponse)).pipe(
        Effect.catchTag("UnknownException", Effect.die),
        Effect.flatMap(() => HttpServerResponse.empty())
      )
      : app
  }))
)
