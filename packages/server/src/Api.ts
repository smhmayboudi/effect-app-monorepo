import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Layer } from "effect"
import { AccountDriven } from "./domain/account/adapter/AccountAdapterDriven.js"
import { AccountDriving } from "./domain/account/adapter/AccountAdapterDriving.js"
import { AccountEventEmitter } from "./domain/account/adapter/AccountAdapterEventEmitter.js"
import { AccountPolicy } from "./domain/account/adapter/AccountAdapterPolicy.js"
import { AccountEventEmitterLive } from "./domain/account/application/AccountApplicationEventEmitter.js"
import { AccountUseCase } from "./domain/account/application/AccountApplicationUseCase.js"
import { GroupDriven } from "./domain/group/adapter/GroupAdapterDriven.js"
import { GroupDriving } from "./domain/group/adapter/GroupAdapterDriving.js"
import { GroupEventEmitter } from "./domain/group/adapter/GroupAdapterEventEmitter.js"
import { GroupPolicy } from "./domain/group/adapter/GroupAdapterPolicy.js"
import { GroupEventEmitterLive } from "./domain/group/application/GroupApplicationEventEmitter.js"
import { GroupUseCase } from "./domain/group/application/GroupApplicationUseCase.js"
import { PersonDriven } from "./domain/person/adapter/PersonAdapterDriven.js"
import { PersonDriving } from "./domain/person/adapter/PersonAdapterDriving.js"
import { PersonEventEmitter } from "./domain/person/adapter/PersonAdapterEventEmitter.js"
import { PersonPolicy } from "./domain/person/adapter/PersonAdapterPolicy.js"
import { PersonEventEmitterLive } from "./domain/person/application/PersonApplicationEventEmitter.js"
import { PersonUseCase } from "./domain/person/application/PersonApplicationUseCase.js"
import { SSEDriving } from "./domain/sse/adapter/SSEAdapterDriving.js"
import { SSEUseCase } from "./domain/sse/application/SSEApplicationUseCase.js"
import { TodoDriven } from "./domain/todo/adapter/TodoAdapterDriven.js"
import { TodoDriving } from "./domain/todo/adapter/TodoAdapterDriving.js"
import { TodoEventEmitter } from "./domain/todo/adapter/TodoAdapterEventEmitter.js"
import { TodoPolicy } from "./domain/todo/adapter/TodoAdapterPolicy.js"
import { TodoEventEmitterLive } from "./domain/todo/application/TodoApplicationEventEmitter.js"
import { TodoUseCase } from "./domain/todo/application/TodoApplicationUseCase.js"
import { UserDriven } from "./domain/user/adapter/UserAdapterDriven.js"
import { UserDriving } from "./domain/user/adapter/UserAdapterDriving.js"
import { UserEventEmitter } from "./domain/user/adapter/UserAdapterEventEmitter.js"
import { UserPolicy } from "./domain/user/adapter/UserAdapterPolicy.js"
import { UserEventEmitterLive } from "./domain/user/application/UserApplicationEventEmitter.js"
import { UserUseCase } from "./domain/user/application/UserApplicationUseCase.js"
import { make } from "./infrastructure/adapter/EventEmitter.js"
import { Redis } from "./infrastructure/adapter/Redis.js"
import { Sql } from "./infrastructure/adapter/Sql.js"
import { SSEManager } from "./infrastructure/adapter/SSEManager.js"
import { UUID } from "./infrastructure/adapter/UUID.js"
import { MiddlewareAuthentication } from "./MiddlewareAuthentication.js"

export const ApiLive = HttpApiBuilder.api(Api)
  .pipe(
    Layer.provide(PersonDriving),
    Layer.provide(MiddlewareAuthentication),
    Layer.provide(PersonUseCase),
    Layer.provide(PersonDriven),
    Layer.provide(PersonPolicy),
    Layer.provide(PersonEventEmitterLive),
    Layer.provide(Layer.effect(PersonEventEmitter, make()))
  )
  .pipe(
    Layer.provide(GroupDriving),
    Layer.provide(MiddlewareAuthentication),
    Layer.provide(GroupUseCase),
    Layer.provide(GroupDriven),
    Layer.provide(GroupPolicy),
    Layer.provide(GroupEventEmitterLive),
    Layer.provide(Layer.effect(GroupEventEmitter, make()))
  )
  .pipe(
    Layer.provide(SSEDriving),
    Layer.provide(MiddlewareAuthentication),
    Layer.provide(SSEUseCase),
    Layer.provide(SSEManager)
  )
  .pipe(
    Layer.provide(TodoDriving),
    Layer.provide(MiddlewareAuthentication),
    Layer.provide(TodoUseCase),
    Layer.provide(TodoDriven),
    Layer.provide(TodoPolicy),
    Layer.provide(TodoEventEmitterLive),
    Layer.provide(Layer.effect(TodoEventEmitter, make()))
  )
  .pipe(
    Layer.provide(UserDriving),
    Layer.provide(MiddlewareAuthentication),
    Layer.provide(UserUseCase),
    Layer.provide(UUID),
    Layer.provide(UserDriven),
    Layer.provide(UserPolicy),
    Layer.provide(UserEventEmitterLive),
    Layer.provide(Layer.effect(UserEventEmitter, make()))
  )
  .pipe(
    Layer.provide(AccountDriving),
    // Layer.provide(MiddlewareAuthenticationLive),
    Layer.provide(AccountUseCase),
    Layer.provide(AccountDriven),
    Layer.provide(AccountPolicy),
    Layer.provide(AccountEventEmitterLive),
    Layer.provide(Layer.effect(AccountEventEmitter, make()))
  )
  .pipe(
    Layer.provide(Redis),
    Layer.provide(Sql)
  )
