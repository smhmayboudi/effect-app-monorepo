import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { WorkflowEngineLayer } from "@template/workflow/RunnerClient"
import { Config, Layer } from "effect"
import { ConfigLive } from "./Config.js"
import { AccountDriven } from "./domain/account/adapter/AccountAdapterDriven.js"
import { AccountDriving } from "./domain/account/adapter/AccountAdapterDriving.js"
import { AccountEventEmitter } from "./domain/account/adapter/AccountAdapterEventEmitter.js"
import { AccountPolicy } from "./domain/account/adapter/AccountAdapterPolicy.js"
import { AccountUseCase } from "./domain/account/application/AccountApplicationUseCase.js"
import { GroupDriven } from "./domain/group/adapter/GroupAdapterDriven.js"
import { GroupDriving } from "./domain/group/adapter/GroupAdapterDriving.js"
import { GroupEventEmitter } from "./domain/group/adapter/GroupAdapterEventEmitter.js"
import { GroupPolicy } from "./domain/group/adapter/GroupAdapterPolicy.js"
import { GroupUseCase } from "./domain/group/application/GroupApplicationUseCase.js"
import { HealthzDriving } from "./domain/healthz/adapter/HealthzAdapterDriving.js"
import { HealthzUseCase } from "./domain/healthz/application/HealthzApplicationUseCase.js"
import { PersonDriven } from "./domain/person/adapter/PersonAdapterDriven.js"
import { PersonDriving } from "./domain/person/adapter/PersonAdapterDriving.js"
import { PersonEventEmitter } from "./domain/person/adapter/PersonAdapterEventEmitter.js"
import { PersonPolicy } from "./domain/person/adapter/PersonAdapterPolicy.js"
import { PersonUseCase } from "./domain/person/application/PersonApplicationUseCase.js"
import { SSEDriving } from "./domain/sse/adapter/SSEAdapterDriving.js"
import { SSEUseCase } from "./domain/sse/application/SSEApplicationUseCase.js"
import { TodoDriven } from "./domain/todo/adapter/TodoAdapterDriven.js"
import { TodoDriving } from "./domain/todo/adapter/TodoAdapterDriving.js"
import { TodoEventEmitter } from "./domain/todo/adapter/TodoAdapterEventEmitter.js"
import { TodoPolicy } from "./domain/todo/adapter/TodoAdapterPolicy.js"
import { TodoUseCase } from "./domain/todo/application/TodoApplicationUseCase.js"
import { UserDriven } from "./domain/user/adapter/UserAdapterDriven.js"
import { UserDriving } from "./domain/user/adapter/UserAdapterDriving.js"
import { UserEventEmitter } from "./domain/user/adapter/UserAdapterEventEmitter.js"
import { UserPolicy } from "./domain/user/adapter/UserAdapterPolicy.js"
import { UserUseCase } from "./domain/user/application/UserApplicationUseCase.js"
import { VWDriven } from "./domain/vw/adapter/VWAdapterDriven.js"
import { VWDriving } from "./domain/vw/adapter/VWAdapterDriving.js"
import { VWElasticsearch } from "./domain/vw/adapter/VWAdapterElasticsearch.js"
import { VWEventEmitter } from "./domain/vw/adapter/VWAdapterEventEmitter.js"
import { VWPolicy } from "./domain/vw/adapter/VWAdapterPolicy.js"
import { VWUseCase } from "./domain/vw/application/VWApplicationUseCase.js"
import { Elasticsearch } from "./infrastructure/adapter/Elasticsearch.js"
import { EventEmitter } from "./infrastructure/adapter/EventEmitter.js"
import { Redis } from "./infrastructure/adapter/Redis.js"
import { ResultPersistenceRedis } from "./infrastructure/adapter/ResultPersistenceRedis.js"
import { Sql } from "./infrastructure/adapter/Sql.js"
import { SSEManager } from "./infrastructure/adapter/SSEManager.js"
import { UUID } from "./infrastructure/adapter/UUID.js"
import { MiddlewareAuthentication } from "./middleware/MiddlewareAuthentication.js"

export const ApiLive = HttpApiBuilder.api(Api)
  .pipe(
    Layer.provide(PersonDriving),
    Layer.provide(PersonUseCase),
    Layer.provide(PersonDriven),
    Layer.provide(PersonEventEmitter),
    Layer.provide(PersonPolicy)
  )
  .pipe(
    Layer.provide(GroupDriving),
    Layer.provide(GroupUseCase),
    Layer.provide(GroupDriven),
    Layer.provide(GroupEventEmitter),
    Layer.provide(GroupPolicy)
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
    Layer.provide(TodoEventEmitter),
    Layer.provide(TodoPolicy)
  )
  .pipe(
    Layer.provide(VWElasticsearch),
    Layer.provide(VWDriving),
    Layer.provide(VWUseCase),
    Layer.provide(VWDriven),
    Layer.provide(VWEventEmitter),
    Layer.provide(VWPolicy)
  )
  .pipe(
    Layer.provide(UserDriving),
    Layer.provide(MiddlewareAuthentication),
    Layer.provide(UserUseCase),
    Layer.provide(UserDriven),
    Layer.provide(UserEventEmitter),
    Layer.provide(UserPolicy)
  )
  .pipe(
    Layer.provide(AccountDriving),
    Layer.provide(AccountUseCase),
    Layer.provide(AccountDriven),
    Layer.provide(AccountEventEmitter),
    Layer.provide(AccountPolicy)
  )
  .pipe(
    Layer.provide(Elasticsearch(ConfigLive.pipe(Config.map((opts) => opts.ElasticsearchLive)))),
    Layer.provide(EventEmitter()),
    Layer.provide(Redis(ConfigLive.pipe(Config.map((opts) => opts.RedisLive)))),
    Layer.provide(ResultPersistenceRedis(ConfigLive.pipe(Config.map((opts) => opts.RedisLive)))),
    Layer.provide(Sql(ConfigLive.pipe(Config.map((opts) => opts.SqliteLive)))),
    Layer.provide(UUID),
    Layer.provide(WorkflowEngineLayer)
  )
