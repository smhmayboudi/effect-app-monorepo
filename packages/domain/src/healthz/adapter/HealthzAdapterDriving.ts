import * as HttpApiEndpoint from "@effect/platform/HttpApiEndpoint"
import * as HttpApiGroup from "@effect/platform/HttpApiGroup"
import * as OpenApi from "@effect/platform/OpenApi"
import * as Schema from "effect/Schema"

export class HealthzDriving extends HttpApiGroup.make("healthz")
  .add(
    HttpApiEndpoint.get("check", "/")
      .addSuccess(Schema.Void, { status: 204 })
      .annotate(OpenApi.Description, "Healthz check")
      .annotate(OpenApi.Summary, "Healthz check")
  )
  .annotate(OpenApi.Description, "Manage Healthz")
  .annotate(OpenApi.Summary, "Manage Healthz")
  .annotate(OpenApi.Title, "Healthz")
  .prefix("/healthz")
{}
