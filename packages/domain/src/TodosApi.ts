import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"

export const TodoId = Schema.Number.pipe(Schema.brand("TodoId"))
export type TodoId = typeof TodoId.Type

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class Todo extends Schema.Class<Todo>("Todo")({
  id: TodoId,
  text: Schema.NonEmptyTrimmedString,
  done: Schema.Boolean
}) {}

export class TodoNotFound extends Schema.TaggedError<TodoNotFound>()("TodoNotFound", {
  id: Schema.Number
}) {}

export class TodosApiGroup extends HttpApiGroup.make("todos")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addSuccess(Todo)
      .setPayload(Schema.Struct({ text: Schema.NonEmptyTrimmedString }))
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addSuccess(Schema.Void)
      .addError(TodoNotFound, { status: 404 })
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .add(HttpApiEndpoint.get("readAll", "/").addSuccess(Schema.Array(Todo)))
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addSuccess(Todo)
      .addError(TodoNotFound, { status: 404 })
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addSuccess(Todo)
      .addError(TodoNotFound, { status: 404 })
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .prefix("/todos")
{}

export class TodosApi extends HttpApi.make("api").add(TodosApiGroup) {}
