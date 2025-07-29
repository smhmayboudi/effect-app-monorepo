import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { ErrorUserEmailAlreadyTaken } from "../application/error-user-email-already-taken.js"
import { DomainUser, DomainUserWithSensitive, Email, UserId } from "../application/domain-user.js"
import { ErrorUserNotFound } from "../application/error-user-not-found.js"

export class UserCreatePayload extends Schema.Class<UserCreatePayload>("UserCreatePayload")({
  email: Email,
}) {}

export const UserIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(UserId)
)

export class UserUpdatePayload extends Schema.Class<UserUpdatePayload>("UserUpdatePayload")({
  email: Email,
}) {}

export class UserDriving extends HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(ErrorUserEmailAlreadyTaken)
      .addSuccess(DomainUserWithSensitive)
      .setPayload(UserCreatePayload)
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorUserEmailAlreadyTaken)
      .addError(ErrorUserNotFound)
      .addSuccess(DomainUser)
      .setPath(Schema.Struct({ id: UserIdFromString }))
      .setPayload(UserUpdatePayload)
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(ErrorUserNotFound)
      .addSuccess(DomainUser)
      .setPath(Schema.Struct({ id: UserIdFromString }))
  )
  .add(
    HttpApiEndpoint.get("readMe", "/me")
      .addSuccess(DomainUserWithSensitive)
  )
  .prefix("/user")
  .annotate(OpenApi.Description, "Manage User")
  .annotate(OpenApi.Title, "User")
{}
