import * as expRequestResolver from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as PrimaryKey from "effect/PrimaryKey"
import * as RequestResolver from "effect/RequestResolver"
import * as Schema from "effect/Schema"
import { TodoConfig } from "./TodoApplicationConfig.js"
import { TodoPortDriven } from "./TodoApplicationPortDriven.js"

export class TodoReadById extends Schema.TaggedRequest<TodoReadById>("TodoReadById")("TodoReadById", {
  failure: TodoErrorNotFound,
  payload: { id: TodoId },
  success: Todo
}) {
  [PrimaryKey.symbol]() {
    return `TodoReadById:${this.id}`
  }
}

export const makeTodoReadResolver = Effect.all([TodoConfig, TodoPortDriven]).pipe(
  Effect.flatMap(([{ cacheTTLMs }, driven]) =>
    RequestResolver.fromEffectTagged<TodoReadById>()({
      TodoReadById: (requests) =>
        driven.readByIds(requests.map((req) => req.id)).pipe(
          Effect.withSpan("TodoUseCase", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "TodoReadById", requests }
          }),
          Effect.tap(() => Effect.logDebug(`DB hit: TodoReadById ${requests.length}`))
        )
    }).pipe(
      expRequestResolver.persisted({
        storeId: "Todo",
        timeToLive: (_req, exit) => Exit.isSuccess(exit) ? cacheTTLMs : 0
      })
    )
  )
)
