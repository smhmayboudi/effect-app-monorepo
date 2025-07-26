import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export const UserId = Schema.UUID.pipe(Schema.brand("UserId"))
export type UserId = Schema.Schema.Type<typeof UserId>

export class UserSignupRequestData extends Schema.Class<UserSignupRequestData>("UserSignupRequestData")({
  email: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  surname: Schema.NonEmptyString,
  birthday: Schema.Date
}) {}

export class User extends Schema.TaggedClass<User>("User")("User", {
  id: UserId,
  ...UserSignupRequestData.fields
}) {
  static decodeUknown = Schema.decodeUnknown(User)
}

export class UserErrorEmailAlreadyTaken
  extends Schema.TaggedError<UserErrorEmailAlreadyTaken>("UserErrorEmailAlreadyTaken")(
    "UserErrorEmailAlreadyTaken",
    { email: Schema.String },
    HttpApiSchema.annotations({ status: 404 })
  )
{
  get message() {
    return `${this.email} is already taken.`
  }
}

export class UserErrorNotFound extends Schema.TaggedError<UserErrorNotFound>("UserErrorNotFound")(
  "UserErrorNotFound",
  { userId: UserId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.userId} not found.`
  }
}

export class UserApi extends HttpApiGroup.make("users").add(
  HttpApiEndpoint.post("signup", "/signup")
    .setPayload(UserSignupRequestData)
    .addError(UserErrorEmailAlreadyTaken)
) {}
