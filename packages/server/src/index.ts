import { HttpApiBuilder, HttpApiScalar, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { ApiLive } from "./api.js"

const HttpApiLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi({ path: "/openapi.json" })),
  Layer.provide(HttpApiScalar.layer({ path: "/references" })),
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(HttpApiLive).pipe(NodeRuntime.runMain)
