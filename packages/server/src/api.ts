import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Layer } from "effect"
import { AccountDriven } from "./domain/account/adapter/account-driven.js"
import { AccountDriving } from "./domain/account/adapter/account-driving.js"
import { AccountPolicy } from "./domain/account/adapter/account-policy.js"
import { AccountUseCase } from "./domain/account/application/account-use-case.js"
import { GroupDriven } from "./domain/group/adapter/group-driven.js"
import { GroupDriving } from "./domain/group/adapter/group-driving.js"
import { GroupPolicy } from "./domain/group/adapter/group-policy.js"
import { GroupUseCase } from "./domain/group/application/group-use-case.js"
import { PersonDriven } from "./domain/person/adapter/person-driven.js"
import { PersonDriving } from "./domain/person/adapter/person-driving.js"
import { PersonPolicy } from "./domain/person/adapter/person-policy.js"
import { PersonUseCase } from "./domain/person/application/person-use-case.js"
import { SSEDriving } from "./domain/sse/adapter/sse-driving.js"
import { SSEUseCase } from "./domain/sse/application/sse-use-case.js"
import { TodoDriven } from "./domain/todo/adapter/todo-driven.js"
import { TodoDriving } from "./domain/todo/adapter/todo-driving.js"
import { TodoPolicy } from "./domain/todo/adapter/todo-policy.js"
import { TodoUseCase } from "./domain/todo/application/todo-use-case.js"
import { UserDriven } from "./domain/user/adapter/user-driven.js"
import { UserDriving } from "./domain/user/adapter/user-driving.js"
import { UserPolicy } from "./domain/user/adapter/user-policy.js"
import { UserUseCase } from "./domain/user/application/user-use-case.js"
import { Sql } from "./infrastructure/adapter/sql.js"
import { SSEManager } from "./infrastructure/adapter/sse-manager.js"
import { UUID } from "./infrastructure/adapter/uuid.js"
import { MiddlewareAuthenticationLive } from "./middleware-authentication.js"

export const ApiLive = HttpApiBuilder.api(Api)
  .pipe(
    Layer.provide(GroupDriving),
    Layer.provide(GroupUseCase),
    Layer.provide(GroupDriven),
    Layer.provide(GroupPolicy)
  )
  .pipe(
    Layer.provide(PersonDriving),
    Layer.provide(PersonUseCase),
    Layer.provide(PersonDriven),
    Layer.provide(PersonPolicy)
  )
  .pipe(
    Layer.provide(SSEDriving),
    Layer.provide(SSEUseCase),
    Layer.provide(SSEManager)
  )
  .pipe(
    Layer.provide(TodoDriving),
    Layer.provide(TodoUseCase),
    Layer.provide(TodoDriven),
    Layer.provide(TodoPolicy)
  )
  .pipe(
    Layer.provide(UserDriving),
    Layer.provide(MiddlewareAuthenticationLive),
    Layer.provide(UserUseCase),
    Layer.provide(UUID),
    Layer.provide(UserDriven),
    Layer.provide(UserPolicy)
  )
  .pipe(
    Layer.provide(AccountDriving),
    Layer.provide(AccountUseCase),
    Layer.provide(AccountDriven),
    Layer.provide(AccountPolicy)
  )
  .pipe(
    Layer.provide(Sql)
  )
