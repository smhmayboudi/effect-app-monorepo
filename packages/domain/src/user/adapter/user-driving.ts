import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { ErrorUserEmailAlreadyTaken } from "../application/error-user-email-already-taken.js"
import { DomainUser, DomainUserWithSensitive, Email, UserId } from "../application/domain-user.js"
import { ErrorUserNotFound } from "../application/error-user-not-found.js"
import { MiddlewareAuthentication } from "../../middleware-authentication.js"
import { ResponseSuccess } from "../../shared/adapter/response.js"

export const UserIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(UserId)
)

export class UserDriving extends HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(ErrorUserNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(UserId))
      .annotate(OpenApi.Description, "User delete")
      .annotate(OpenApi.Summary, "User delete")
      .setPath(Schema.Struct({ id: UserIdFromString }))
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(ResponseSuccess(Schema.Array(DomainUser)))
      .annotate(OpenApi.Description, "User readAll")
      .annotate(OpenApi.Summary, "User readAll")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(ErrorUserNotFound)
      .addSuccess(ResponseSuccess(DomainUser))
      .setPath(Schema.Struct({ id: UserIdFromString }))
      .annotate(OpenApi.Description, "User readById")
      .annotate(OpenApi.Summary, "User readById")
  )
  .add(
    HttpApiEndpoint.get("readByIdWithSensitive", "/me")
      .addSuccess(ResponseSuccess(DomainUserWithSensitive))
      .annotate(OpenApi.Description, "User readByIdWithSensitive")
      .annotate(OpenApi.Summary, "User readByIdWithSensitive")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorUserEmailAlreadyTaken)
      .addError(ErrorUserNotFound)
      .addSuccess(ResponseSuccess(UserId))
      .annotate(OpenApi.Description, "User update")
      .annotate(OpenApi.Summary, "User update")
      .setPath(Schema.Struct({ id: UserIdFromString }))
      .setPayload(Schema.Struct({ email: Email }))
  )
  .middlewareEndpoints(MiddlewareAuthentication)
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(ErrorUserEmailAlreadyTaken)
      .addSuccess(ResponseSuccess(DomainUserWithSensitive))
      .annotate(OpenApi.Description, "User create")
      .annotate(OpenApi.Summary, "User create")
      .setPayload(Schema.Struct({ email: Email }))
  )
  .annotate(OpenApi.Description, "Manage User")
  .annotate(OpenApi.Summary, "Manage User")
  .annotate(OpenApi.Title, "User")
  .prefix("/user")
{}
