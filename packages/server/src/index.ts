import { HttpApiBuilder, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { TodoDriving } from "./domain/todo/adapter/todo-driving.js"
import { UserDriving } from "./domain/user/adapter/user-driving.js"
import { Api } from "@template/domain/Api"
import { TodoUseCase } from "./domain/todo/application/todo-use-case.js"
import { UserUseCase } from "./domain/user/application/user-use-case.js"
import { UserDriven } from "./domain/user/adapter/user-driven.js"
import { TodoDriven } from "./domain/todo/adapter/todo-driven.js"

export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(TodoDriving),
  Layer.provide(TodoUseCase),
  Layer.provide(TodoDriven),
  Layer.provide(UserDriving),
  Layer.provide(UserUseCase),
  Layer.provide(UserDriven)
)

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi({ path: "/docs/openapi.json" })),
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(HttpLive).pipe(NodeRuntime.runMain)
