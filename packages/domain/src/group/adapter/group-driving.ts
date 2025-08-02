import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { GroupId } from "@template/domain/group/application/domain-group"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { MiddlewareAuthentication } from "@template/domain/middleware-authentication"
import { ResponseSuccess } from "@template/domain/shared/adapter/response"
import { Schema } from "effect"

export const GroupIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(GroupId)
)

export class GroupDriving extends HttpApiGroup.make("group")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addSuccess(ResponseSuccess(GroupId))
      .setPayload(Schema.Struct({ name: Schema.NonEmptyString }))
      .annotate(OpenApi.Description, "Group create")
      .annotate(OpenApi.Summary, "Group create")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorGroupNotFound)
      .addSuccess(ResponseSuccess(GroupId))
      .setPath(Schema.Struct({ id: GroupIdFromString }))
      .setPayload(Schema.Struct({ name: Schema.NonEmptyString }))
      .annotate(OpenApi.Description, "Group update")
      .annotate(OpenApi.Summary, "Group update")
  )
  .middlewareEndpoints(MiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Group")
  .annotate(OpenApi.Summary, "Manage Group")
  .annotate(OpenApi.Title, "Group")
  .prefix("/group")
{}
