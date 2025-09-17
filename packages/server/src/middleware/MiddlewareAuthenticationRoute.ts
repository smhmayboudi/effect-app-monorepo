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

    if (
      segments.length >= 2 &&
      segments[0] === "auth" &&
      (request.method === "GET" || request.method === "OPTIONS" || request.method === "POST")
    ) {
      const allowedOrigins = [
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173",
        "http://localhost:3001",
        "http://localhost:5173"
      ]
      if (request.method === "OPTIONS") {
        return HttpServerResponse.empty({
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "authorization,b3,content-type,idempotency-key,traceparent",
            "Access-Control-Allow-Methods": "DELETE,GET,OPTIONS,PATCH,POST,PUT",
            "Access-Control-Allow-Origin": allowedOrigins.includes(request.headers["origin"])
              ? request.headers["origin"]
              : "",
            "Access-Control-Expose-Headers": "authorization,content-type",
            "Access-Control-Max-Age": "86400"
          },
          status: 204
        })
      }
      nodeResponse.setHeader("Access-Control-Allow-Credentials", "true")
      nodeResponse.setHeader(
        "Access-Control-Allow-Headers",
        "authorization,b3,content-type,idempotency-key,traceparent"
      )
      nodeResponse.setHeader("Access-Control-Allow-Methods", "DELETE,GET,OPTIONS,PATCH,POST,PUT")
      nodeResponse.setHeader(
        "Access-Control-Allow-Origin",
        allowedOrigins.includes(request.headers["origin"]) ? request.headers["origin"] : ""
      )
      nodeResponse.setHeader("Access-Control-Expose-Headers", "authorization,content-type")
      nodeResponse.setHeader("Access-Control-Max-Age", "86400")

      return Effect.tryPromise(() => toNodeHandler(authF(ServiceId.make(segments[1])))(nodeRequest, nodeResponse)).pipe(
        Effect.catchTag("UnknownException", Effect.die),
        Effect.flatMap(() => HttpServerResponse.empty())
      )
    }

    return app
  }))
)
