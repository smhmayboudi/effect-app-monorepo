import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { MiddlewareAuthentication } from "../../MiddlewareAuthentication.js"
import { ResponseSuccess } from "../../shared/adapter/Response.js"
import { URLParams } from "../../shared/adapter/URLParams.js"
import { User, UserId, UserWithSensitive } from "../application/UserApplicationDomain.js"
import { UserErrorEmailAlreadyTaken } from "../application/UserApplicationErrorEmailAlreadyTaken.js"
import { UserErrorNotFound } from "../application/UserApplicationErrorNotFound.js"

export const UserIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(UserId)
)

export class UserDriving extends HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(UserErrorNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(UserId))
      .setPath(Schema.Struct({ id: UserIdFromString }))
      .annotate(OpenApi.Description, "User delete")
      .annotate(OpenApi.Summary, "User delete")
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(ResponseSuccess(Schema.Array(User)))
      .setUrlParams(URLParams(User))
      .annotate(OpenApi.Description, "User readAll")
      .annotate(OpenApi.Summary, "User readAll")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(UserErrorNotFound)
      .addSuccess(ResponseSuccess(User))
      .setPath(Schema.Struct({ id: UserIdFromString }))
      .annotate(OpenApi.Description, "User readById")
      .annotate(OpenApi.Summary, "User readById")
  )
  .add(
    HttpApiEndpoint.get("readByIdWithSensitive", "/me")
      .addSuccess(ResponseSuccess(UserWithSensitive))
      .annotate(OpenApi.Description, "User readByIdWithSensitive")
      .annotate(OpenApi.Summary, "User readByIdWithSensitive")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(UserErrorEmailAlreadyTaken)
      .addError(UserErrorNotFound)
      .addSuccess(ResponseSuccess(UserId))
      .setPath(Schema.Struct({ id: UserIdFromString }))
      .setPayload(User.pipe(Schema.pick("email")))
      .annotate(OpenApi.Description, "User update")
      .annotate(OpenApi.Summary, "User update")
  )
  .middlewareEndpoints(MiddlewareAuthentication)
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(UserErrorEmailAlreadyTaken)
      .addSuccess(ResponseSuccess(UserWithSensitive))
      .setPayload(User.pipe(Schema.pick("email")))
      .annotate(OpenApi.Description, "User create")
      .annotate(OpenApi.Summary, "User create")
  )
  .annotate(OpenApi.Description, "Manage User")
  .annotate(OpenApi.Summary, "Manage User")
  .annotate(OpenApi.Title, "User")
  .prefix("/user")
{}
