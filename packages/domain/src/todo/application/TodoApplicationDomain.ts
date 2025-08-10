import { Schema } from "effect"
import { AccountId } from "../../account/application/AccountApplicationDomain.js"

export const TodoId = Schema.Number.pipe(
  Schema.brand("TodoId"),
  Schema.annotations({ description: "Todo identification" })
)
export type TodoId = typeof TodoId.Type

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export const TodoSchema = Schema.Struct({
  id: TodoId,
  ownerId: AccountId,
  done: Schema.Literal(0, 1).annotations({ description: "Done" }),
  text: Schema.NonEmptyTrimmedString.annotations({ description: "Text" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
}).pipe(Schema.annotations({ description: "Todo", identifier: "Todo" }))
export type TodoSchema = Schema.Schema.Type<typeof TodoSchema>

export class Todo extends Schema.Class<Todo>("Todo")(TodoSchema) {
  static decodeUnknown = Schema.decodeUnknown(Todo)
}
