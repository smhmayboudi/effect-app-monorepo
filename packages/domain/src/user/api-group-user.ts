import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { ErrorUserEmailAlreadyTaken } from "./application/error-user-email-already-taken.js"
import { UserId } from "./application/domain-user.js"

export class UserSignupPayload extends Schema.Class<UserSignupPayload>("UserSignupPayload")({
  birthday: Schema.Date,
  email: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  surname: Schema.NonEmptyString,
}) {}

export class ApiGroupUser extends HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.post("signup", "/signup")
      .addError(ErrorUserEmailAlreadyTaken)
      .addSuccess(UserId)
      .setPayload(UserSignupPayload)
  )
  .prefix("/user")
  .annotate(OpenApi.Description, "Manage User")
  .annotate(OpenApi.Title, "User")
{}
