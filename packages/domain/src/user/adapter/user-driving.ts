import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { ErrorUserEmailAlreadyTaken } from "../application/error-user-email-already-taken.js"
import { DomainUser, DomainUserWithSensitive, Email, UserId } from "../application/domain-user.js"
import { ErrorUserNotFound } from "../application/error-user-not-found.js"

export const UserIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(UserId)
)

export class UserDriving extends HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(ErrorUserEmailAlreadyTaken)
      // .addSuccess(DomainUserWithSensitive)
      .addSuccess(UserId)
      .setPayload(Schema.Struct({ email: Email }))
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(ErrorUserNotFound, { status: 404 })
      .addSuccess(UserId)
      .setPath(Schema.Struct({ id: UserIdFromString }))
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(Schema.Array(DomainUser))
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(ErrorUserNotFound)
      .addSuccess(DomainUser)
      .setPath(Schema.Struct({ id: UserIdFromString }))
  )
  .add(
    HttpApiEndpoint.get("readByMe", "/me")
      .addSuccess(DomainUserWithSensitive)
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorUserEmailAlreadyTaken)
      .addError(ErrorUserNotFound)
      .addSuccess(UserId)
      .setPath(Schema.Struct({ id: UserIdFromString }))
      .setPayload(Schema.Struct({ email: Email }))
  )
  .prefix("/user")
  .annotate(OpenApi.Description, "Manage User")
  .annotate(OpenApi.Title, "User")
{}
