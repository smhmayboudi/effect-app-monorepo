import { Schema } from "effect"

export const TodoId = Schema.Number.pipe(Schema.brand("TodoId"))
export type TodoId = typeof TodoId.Type

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class DomainTodo extends Schema.Class<DomainTodo>("DomainTodo")({
  done: Schema.Boolean,
  id: TodoId,
  text: Schema.NonEmptyTrimmedString
}) {}
