import { Layer } from "effect";
import { Api } from "@template/domain/api"
import { AccountDriven } from "@template/server/domain/account/adapter/account-driven"
import { AccountDriving } from "@template/server/domain/account/adapter/account-driving"
import { AccountUseCase } from "@template/server/domain/account/application/account-use-case"
import { GroupDriven } from "@template/server/domain/group/adapter/group-driven"
import { GroupDriving } from "@template/server/domain/group/adapter/group-driving"
import { GroupUseCase } from "@template/server/domain/group/application/group-use-case"
import { PersonDriven } from "@template/server/domain/person/adapter/person-driven"
import { PersonDriving } from "@template/server/domain/person/adapter/person-driving"
import { PersonUseCase } from "@template/server/domain/person/application/person-use-case"
import { TodoDriven } from "@template/server/domain/todo/adapter/todo-driven"
import { TodoDriving } from "@template/server/domain/todo/adapter/todo-driving"
import { TodoUseCase } from "@template/server/domain/todo/application/todo-use-case"
import { UserDriven } from "@template/server/domain/user/adapter/user-driven"
import { UserDriving } from "@template/server/domain/user/adapter/user-driving"
import { UserUseCase } from "@template/server/domain/user/application/user-use-case"
import { Sql } from "@template/server/infrastructure/adapter/sql"
import { MiddlewareAuthenticationLive } from "@template/server/middleware-authentication"
import { HttpApiBuilder } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { AccountPolicy } from "@template/server/domain/account/adapter/account-policy";
import { GroupPolicy } from "@template/server/domain/group/adapter/group-policy";
import { PersonPolicy } from "@template/server/domain/person/adapter/person-policy";
import { TodoPolicy } from "@template/server/domain/todo/adapter/todo-policy";
import { UserPolicy } from "@template/server/domain/user/adapter/user-policy";
import { UUID } from "@template/server/infrastructure/adapter/uuid";

export const ApiLive = HttpApiBuilder.api(Api)
  .pipe(
    Layer.provide(GroupDriving),
    Layer.provide(GroupUseCase),
    Layer.provide(GroupDriven),
    Layer.provide(GroupPolicy),
  )
  .pipe(
    Layer.provide(PersonDriving),
    Layer.provide(PersonUseCase),
    Layer.provide(PersonDriven),
    Layer.provide(PersonPolicy),
  )
  .pipe(
    Layer.provide(TodoDriving),
    Layer.provide(TodoUseCase),
    Layer.provide(TodoDriven),
    Layer.provide(TodoPolicy),
  )
  .pipe(
    Layer.provide(UserDriving),
    Layer.provide(MiddlewareAuthenticationLive),
    Layer.provide(UserUseCase),
    Layer.provide(UUID),
    Layer.provide(UserDriven),
    Layer.provide(UserPolicy),
  )
  .pipe(
    Layer.provide(AccountDriving),
    Layer.provide(AccountUseCase),
    Layer.provide(AccountDriven),
    Layer.provide(AccountPolicy),
  )
  .pipe(
    Layer.provide(Sql),
    Layer.provide(NodeContext.layer)
  )
