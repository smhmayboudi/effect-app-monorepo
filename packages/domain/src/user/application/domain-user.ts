import { Schema } from "effect"

export const UserId = Schema.UUID.pipe(Schema.brand("UserId"))
export type UserId = Schema.Schema.Type<typeof UserId>

export class User extends Schema.TaggedClass<User>("User")("User", {
  birthday: Schema.Date,
  email: Schema.NonEmptyString,
  id: UserId,
  name: Schema.NonEmptyString,
  surname: Schema.NonEmptyString,
}) {
  static decodeUknown = Schema.decodeUnknown(User)
}
