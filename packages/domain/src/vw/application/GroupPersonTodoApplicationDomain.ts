import * as Schema from "effect/Schema"
import { GroupSchema } from "../../group/application/GroupApplicationDomain.js"
import { PersonSchema } from "../../person/application/PersonApplicationDomain.js"
import { TodoSchema } from "../../todo/application/TodoApplicationDomain.js"

export const GroupPersonTodoSchema = Schema.Struct({
  group: GroupSchema,
  person: PersonSchema,
  todo: TodoSchema
}).pipe(Schema.annotations({ description: "GroupPersonTodo", identifier: "GroupPersonTodo" }))
export type GroupPersonTodoSchema = typeof GroupPersonTodoSchema.Type

export class GroupPersonTodo
  extends Schema.TaggedClass<GroupPersonTodo>("GroupPersonTodo")("GroupPersonTodo", GroupPersonTodoSchema)
{
  static decodeUnknown = Schema.decodeUnknown(GroupPersonTodo)
}
