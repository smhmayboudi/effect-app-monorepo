import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"
import { ResponseSuccess } from "../../shared/adapter/Response.js"
import { GroupId, GroupSchema } from "../application/GroupApplicationDomain.js"
import { GroupErrorNotFound } from "../application/GroupApplicationErrorNotFound.js"

export const GroupIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(GroupId)
)

export class GroupDriving extends HttpApiGroup.make("group")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addSuccess(ResponseSuccess(GroupId))
      .setPayload(GroupSchema.pipe(Schema.pick("name")))
      .annotate(OpenApi.Description, "Group create")
      .annotate(OpenApi.Summary, "Group create")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(GroupErrorNotFound)
      .addSuccess(ResponseSuccess(GroupId))
      .setPath(Schema.Struct({ id: GroupIdFromString }))
      .setPayload(GroupSchema.pipe(Schema.pick("name")))
      .annotate(OpenApi.Description, "Group update")
      .annotate(OpenApi.Summary, "Group update")
  )
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Group")
  .annotate(OpenApi.Summary, "Manage Group")
  .annotate(OpenApi.Title, "Group")
  .prefix("/group")
{}
