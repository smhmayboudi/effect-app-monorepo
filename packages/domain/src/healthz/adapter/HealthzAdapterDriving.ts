import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"

export class HealthzDriving extends HttpApiGroup.make("healthz")
  .add(
    HttpApiEndpoint.get("check", "/")
      .addSuccess(Schema.String)
      .annotate(OpenApi.Description, "Healthz check")
      .annotate(OpenApi.Summary, "Healthz check")
  )
  .annotate(OpenApi.Description, "Manage Healthz")
  .annotate(OpenApi.Summary, "Manage Healthz")
  .annotate(OpenApi.Title, "Healthz")
  .prefix("/healthz")
{}
