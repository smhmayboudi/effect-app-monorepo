import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { GroupId } from "../application/domain-group.js"
import { ErrorGroupNotFound } from "../application/error-group-not-found.js"
import { MiddlewareAuthentication } from "../../middleware-authentication.js"

export const GroupIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(GroupId)
)

export class GroupDriving extends HttpApiGroup.make("group")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addSuccess(GroupId)
      .setPayload(Schema.Struct({ name: Schema.NonEmptyString }))
      .annotate(OpenApi.Description, "Group create")
      .annotate(OpenApi.Summary, "Group create")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorGroupNotFound)
      .addSuccess(GroupId)
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
