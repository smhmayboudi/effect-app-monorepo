import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { DomainGroup, GroupId } from "../application/domain-group.js"
import { ErrorGroupNotFound } from "../application/error-group-not-found.js"

export class GroupCreatePayload extends Schema.Class<GroupCreatePayload>("GroupCreatePayload")({
  name: Schema.NonEmptyString,
}) {}

export const GroupIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(GroupId)
)

export class GroupUpdatePayload extends Schema.Class<GroupUpdatePayload>("GroupUpdatePayload")({
  name: Schema.NonEmptyString,
}) {}

export class GroupDriving extends HttpApiGroup.make("group")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addSuccess(DomainGroup)
      .setPayload(GroupCreatePayload)
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorGroupNotFound)
      .addSuccess(DomainGroup)
      .setPath(Schema.Struct({ id: GroupIdFromString }))
      .setPayload(GroupUpdatePayload)
  )
  .prefix("/group")
  .annotate(OpenApi.Description, "Manage Group")
  .annotate(OpenApi.Title, "Group")
{}
