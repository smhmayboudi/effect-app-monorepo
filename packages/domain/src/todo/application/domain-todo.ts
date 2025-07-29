import { Schema } from "effect"
import { AccountId } from "../../account/application/domain-account.js"

export const TodoId = Schema.Number.pipe(Schema.brand("TodoId"))
export type TodoId = typeof TodoId.Type

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class DomainTodo extends Schema.Class<DomainTodo>("DomainTodo")({
  id: TodoId,
  accountId: AccountId,
  done: Schema.Boolean,
  text: Schema.NonEmptyTrimmedString,
  createdAt: Schema.Date,
  updatedAt: Schema.Date
}) {
  static decodeUknown = Schema.decodeUnknown(DomainTodo)
}
