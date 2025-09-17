import { HttpMiddleware, HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { NodeHttpServerRequest } from "@effect/platform-node"
import { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { toNodeHandler } from "better-auth/node"
import { Effect } from "effect"
import { authF } from "../infrastructure/adapter/Authentication/Authentication.js"

export const MiddlewareAuthenticationRoute = HttpMiddleware.make((app) =>
  HttpServerRequest.HttpServerRequest.pipe(Effect.flatMap((request) => {
    const segments = request.url.split("/").filter(Boolean)
    const nodeRequest = NodeHttpServerRequest.toIncomingMessage(request)
    const nodeResponse = NodeHttpServerRequest.toServerResponse(request)

    return (segments.length >= 2 && segments[0] === "auth" && (request.method === "GET" || request.method === "POST")) ?
      Effect.tryPromise(() => toNodeHandler(authF(ServiceId.make(segments[1])))(nodeRequest, nodeResponse)).pipe(
        Effect.catchTag("UnknownException", Effect.die),
        Effect.flatMap(() => HttpServerResponse.empty())
      )
      : app
  }))
)
