import { Schema } from "effect"
import { TodoSchema } from "../../todo/application/TodoApplicationDomain.js"
import { UserSchema } from "../../user/application/UserApplicationDomain.js"

export const UserTodoSchema = Schema.Struct({
  user: UserSchema,
  todo: TodoSchema
}).pipe(Schema.annotations({ description: "UserTodo", identifier: "UserTodo" }))
export type UserTodoSchema = typeof UserTodoSchema.Type

export class UserTodo extends Schema.Class<UserTodo>("UserTodo")(UserTodoSchema) {
  static decodeUnknown = Schema.decodeUnknown(UserTodo)
}
