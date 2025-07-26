import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"

export const TodoId = Schema.Number.pipe(Schema.brand("TodoId"))
export type TodoId = typeof TodoId.Type

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class Todo extends Schema.Class<Todo>("Todo")({
  done: Schema.Boolean,
  id: TodoId,
  text: Schema.NonEmptyTrimmedString
}) {}

export class TodoCreatePayload extends Schema.Class<TodoCreatePayload>("TodoCreatePayload")({
  text: Schema.NonEmptyTrimmedString
}) {}

export class TodoPath extends Schema.Class<TodoPath>("TodoPath")({
  id: TodoIdFromString
}) {}

export class TodoErrorAlreadyExists extends Schema.TaggedError<TodoErrorAlreadyExists>()("TodoErrorAlreadyExists", {
  text: Schema.NonEmptyTrimmedString
}) {}

export class TodoErrorNotFound extends Schema.TaggedError<TodoErrorNotFound>()("TodoErrorNotFound", {
  id: Schema.Number
}) {}

export class TodoApiGroup extends HttpApiGroup.make("todo")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addSuccess(Todo)
      .addError(TodoErrorAlreadyExists, { status: 404 })
      .setPayload(TodoCreatePayload)
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addSuccess(Schema.Void)
      .addError(TodoErrorNotFound, { status: 404 })
      .setPath(TodoPath)
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(Schema.Array(Todo))
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addSuccess(Todo)
      .addError(TodoErrorNotFound, { status: 404 })
      .setPath(TodoPath)
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addSuccess(Todo)
      .addError(TodoErrorNotFound, { status: 404 })
      .setPath(TodoPath)
  )
  .prefix("/todo")
{}

export class TodoApi extends HttpApi.make("api").add(TodoApiGroup) {}
