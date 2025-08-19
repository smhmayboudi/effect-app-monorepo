import { Schema } from "effect"
import { GroupSchema } from "../../group/application/GroupApplicationDomain.js"
import { PersonSchema } from "../../person/application/PersonApplicationDomain.js"
import { UserSchema } from "../../user/application/UserApplicationDomain.js"

export const UserGroupPersonSchema = Schema.Struct({
  user: UserSchema,
  group: GroupSchema,
  person: PersonSchema
}).pipe(Schema.annotations({ description: "UserGroupPerson", identifier: "UserGroupPerson" }))
export type UserGroupPersonSchema = typeof UserGroupPersonSchema.Type

export class UserGroupPerson extends Schema.Class<UserGroupPerson>("UserGroupPerson")(UserGroupPersonSchema) {
  static decodeUnknown = Schema.decodeUnknown(UserGroupPerson)
}
