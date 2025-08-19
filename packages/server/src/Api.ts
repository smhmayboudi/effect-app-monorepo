import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Layer } from "effect"
import { AccountDriven } from "./domain/account/adapter/AccountAdapterDriven.js"
import { AccountDriving } from "./domain/account/adapter/AccountAdapterDriving.js"
import { AccountEventEmitter } from "./domain/account/adapter/AccountAdapterEventEmitter.js"
import { AccountPolicy } from "./domain/account/adapter/AccountAdapterPolicy.js"
import { AccountPortEventEmitter } from "./domain/account/application/AccountApplicationPortEventEmitter.js"
import { AccountUseCase } from "./domain/account/application/AccountApplicationUseCase.js"
import { GroupDriven } from "./domain/group/adapter/GroupAdapterDriven.js"
import { GroupDriving } from "./domain/group/adapter/GroupAdapterDriving.js"
import { GroupEventEmitter } from "./domain/group/adapter/GroupAdapterEventEmitter.js"
import { GroupPolicy } from "./domain/group/adapter/GroupAdapterPolicy.js"
import { GroupPortEventEmitter } from "./domain/group/application/GroupApplicationPortEventEmitter.js"
import { GroupUseCase } from "./domain/group/application/GroupApplicationUseCase.js"
import { HealthzDriving } from "./domain/healthz/adapter/HealthzAdapterDriving.js"
import { HealthzUseCase } from "./domain/healthz/application/HealthzApplicationUseCase.js"
import { PersonDriven } from "./domain/person/adapter/PersonAdapterDriven.js"
import { PersonDriving } from "./domain/person/adapter/PersonAdapterDriving.js"
import { PersonEventEmitter } from "./domain/person/adapter/PersonAdapterEventEmitter.js"
import { PersonPolicy } from "./domain/person/adapter/PersonAdapterPolicy.js"
import { PersonPortEventEmitter } from "./domain/person/application/PersonApplicationPortEventEmitter.js"
import { PersonUseCase } from "./domain/person/application/PersonApplicationUseCase.js"
import { SSEDriving } from "./domain/sse/adapter/SSEAdapterDriving.js"
import { SSEUseCase } from "./domain/sse/application/SSEApplicationUseCase.js"
import { TodoDriven } from "./domain/todo/adapter/TodoAdapterDriven.js"
import { TodoDriving } from "./domain/todo/adapter/TodoAdapterDriving.js"
import { TodoEventEmitter } from "./domain/todo/adapter/TodoAdapterEventEmitter.js"
import { TodoPolicy } from "./domain/todo/adapter/TodoAdapterPolicy.js"
import { TodoPortEventEmitter } from "./domain/todo/application/TodoApplicationPortEventEmitter.js"
import { TodoUseCase } from "./domain/todo/application/TodoApplicationUseCase.js"
import { UserDriven } from "./domain/user/adapter/UserAdapterDriven.js"
import { UserDriving } from "./domain/user/adapter/UserAdapterDriving.js"
import { UserEventEmitter } from "./domain/user/adapter/UserAdapterEventEmitter.js"
import { UserPolicy } from "./domain/user/adapter/UserAdapterPolicy.js"
import { UserPortEventEmitter } from "./domain/user/application/UserApplicationPortEventEmitter.js"
import { UserUseCase } from "./domain/user/application/UserApplicationUseCase.js"
import { VWDriven } from "./domain/vw/adapter/VWAdapterDriven.js"
import { VWDriving } from "./domain/vw/adapter/VWAdapterDriving.js"
import { VWEventEmitter } from "./domain/vw/adapter/VWAdapterEventEmitter.js"
import { VWPolicy } from "./domain/vw/adapter/VWAdapterPolicy.js"
import { VWPortEventEmitter } from "./domain/vw/application/VWApplicationPortEventEmitter.js"
import { VWUseCase } from "./domain/vw/application/VWApplicationUseCase.js"
import { Elasticsearch } from "./infrastructure/adapter/Elasticsearch.js"
import { make } from "./infrastructure/adapter/EventEmitter.js"
import { Redis } from "./infrastructure/adapter/Redis.js"
import { Sql } from "./infrastructure/adapter/Sql.js"
import { SSEManager } from "./infrastructure/adapter/SSEManager.js"
import { UUID } from "./infrastructure/adapter/UUID.js"
import { MiddlewareAuthentication } from "./MiddlewareAuthentication.js"

export const ApiLive = HttpApiBuilder.api(Api)
  .pipe(
    Layer.provide(PersonDriving),
    Layer.provide(PersonUseCase),
    Layer.provide(PersonDriven),
    Layer.provide(PersonPolicy),
    Layer.provide(PersonEventEmitter),
    Layer.provide(Layer.effect(PersonPortEventEmitter, make()))
  )
  .pipe(
    Layer.provide(GroupDriving),
    Layer.provide(GroupUseCase),
    Layer.provide(GroupDriven),
    Layer.provide(GroupPolicy),
    Layer.provide(GroupEventEmitter),
    Layer.provide(Layer.effect(GroupPortEventEmitter, make()))
  )
  .pipe(
    Layer.provide(HealthzDriving),
    Layer.provide(HealthzUseCase)
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
    Layer.provide(TodoPolicy),
    Layer.provide(TodoEventEmitter),
    Layer.provide(Layer.effect(TodoPortEventEmitter, make()))
  )
  .pipe(
    Layer.provide(VWDriving),
    Layer.provide(VWUseCase),
    Layer.provide(VWDriven),
    Layer.provide(VWPolicy),
    Layer.provide(VWEventEmitter),
    Layer.provide(Layer.effect(VWPortEventEmitter, make()))
  )
  .pipe(
    Layer.provide(UserDriving),
    Layer.provide(MiddlewareAuthentication),
    Layer.provide(UserUseCase),
    Layer.provide(UUID),
    Layer.provide(UserDriven),
    Layer.provide(UserPolicy),
    Layer.provide(UserEventEmitter),
    Layer.provide(Layer.effect(UserPortEventEmitter, make()))
  )
  .pipe(
    Layer.provide(AccountDriving),
    Layer.provide(AccountUseCase),
    Layer.provide(AccountDriven),
    Layer.provide(AccountPolicy),
    Layer.provide(AccountEventEmitter),
    Layer.provide(Layer.effect(AccountPortEventEmitter, make()))
  )
  .pipe(
    Layer.provide(Elasticsearch({ node: "http://127.0.0.1:9200" })),
    Layer.provide(Redis),
    Layer.provide(Sql)
  )
