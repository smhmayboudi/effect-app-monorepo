import { HttpApiBuilder, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeContext, NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { Api } from "@template/domain/api"
import { AccountDriven } from "./domain/account/adapter/account-driven.js"
import { AccountDriving } from "./domain/account/adapter/account-driving.js"
import { AccountUseCase } from "./domain/account/application/account-use-case.js"
import { GroupDriven } from "./domain/group/adapter/group-driven.js"
import { GroupDriving } from "./domain/group/adapter/group-driving.js"
import { GroupUseCase } from "./domain/group/application/group-use-case.js"
import { PersonDriven } from "./domain/person/adapter/person-driven.js"
import { PersonDriving } from "./domain/person/adapter/person-driving.js"
import { PersonUseCase } from "./domain/person/application/person-use-case.js"
import { TodoDriven } from "./domain/todo/adapter/todo-driven.js"
import { TodoDriving } from "./domain/todo/adapter/todo-driving.js"
import { TodoUseCase } from "./domain/todo/application/todo-use-case.js"
import { UserDriven } from "./domain/user/adapter/user-driven.js"
import { UserDriving } from "./domain/user/adapter/user-driving.js"
import { UserUseCase } from "./domain/user/application/user-use-case.js"
import { Sql } from "./infrastructure/adapter/sql.js"

export const ApiLive = HttpApiBuilder.api(Api).pipe(
  Layer.provide(AccountDriving),
  Layer.provide(AccountUseCase),
  Layer.provide(AccountDriven),
  Layer.provide(GroupDriving),
  Layer.provide(GroupUseCase),
  Layer.provide(GroupDriven),
  Layer.provide(PersonDriving),
  Layer.provide(PersonUseCase),
  Layer.provide(PersonDriven),
  Layer.provide(TodoDriving),
  Layer.provide(TodoUseCase),
  Layer.provide(TodoDriven),
  Layer.provide(UserDriving),
  Layer.provide(UserUseCase),
  Layer.provide(UserDriven),
  Layer.provide(Sql),
  Layer.provide(NodeContext.layer)
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
