import { Schema } from "effect"
import { AccountId } from "../../account/application/domain-account.js"

export const TodoId = Schema.Number.pipe(Schema.brand("TodoId"))
export type TodoId = typeof TodoId.Type

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class DomainTodo extends Schema.Class<DomainTodo>("DomainTodo")({
  id: TodoId,
  ownerId: AccountId,
  done: Schema.Literal(0, 1),
  text: Schema.NonEmptyTrimmedString,
  createdAt: Schema.Date,
  updatedAt: Schema.Date
}) {
  static decodeUnknown = Schema.decodeUnknown(DomainTodo)
}
