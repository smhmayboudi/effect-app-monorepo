import { AccountId } from "@template/domain/account/application/domain-account"
import { Schema } from "effect"

export const TodoId = Schema.Number.pipe(Schema.brand("TodoId"))
export type TodoId = typeof TodoId.Type

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class DomainTodo extends Schema.Class<DomainTodo>("DomainTodo")({
  id: TodoId,
  ownerId: AccountId,
  done: Schema.Boolean,
  text: Schema.NonEmptyTrimmedString,
  createdAt: Schema.Date,
  updatedAt: Schema.Date
}) {
  static decodeUknown = Schema.decodeUnknown(DomainTodo)
}
