import { persisted } from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import { Effect, Exit, PrimaryKey, RequestResolver, Schema } from "effect"
import { TodoConfig } from "./TodoApplicationConfig.js"
import { TodoPortDriven } from "./TodoApplicationPortDriven.js"

export class TodoReadById extends Schema.TaggedRequest<TodoReadById>()("TodoReadById", {
  failure: TodoErrorNotFound,
  payload: { id: TodoId },
  success: Todo
}) {
  [PrimaryKey.symbol]() {
    return `TodoReadById:${this.id}`
  }
}

export const makeTodoReadResolver = Effect.gen(function*() {
  const { cacheTTLMs } = yield* TodoConfig
  const driven = yield* TodoPortDriven
  const resolver = yield* RequestResolver.fromEffectTagged<TodoReadById>()({
    TodoReadById: (requests) =>
      driven.readByIds(requests.map((req) => req.id)).pipe(
        Effect.withSpan("TodoUseCase", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "TodoReadById", requests }
        }),
        Effect.tap(() => Effect.logDebug("DB hit: TodoReadById", requests.length))
      )
  }).pipe(
    persisted({
      storeId: "Todo",
      timeToLive: (_req, exit) => Exit.isSuccess(exit) ? cacheTTLMs : 0
    })
  )

  return resolver
})
