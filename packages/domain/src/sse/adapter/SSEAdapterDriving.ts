import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { MiddlewareAuthentication } from "../../MiddlewareAuthentication.js"

export class SSEDriving extends HttpApiGroup.make("sse")
  .add(
    HttpApiEndpoint.get("connect", "/connect")
      .addSuccess(Schema.Unknown)
      .annotate(OpenApi.Description, "SSE connect")
      .annotate(OpenApi.Summary, "SSE connect")
  )
  .add(
    HttpApiEndpoint.post("notify", "/notify")
      .addSuccess(Schema.Void)
      .annotate(OpenApi.Description, "SSE notify")
      .annotate(OpenApi.Summary, "SSE notify")
  )
  .middlewareEndpoints(MiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage SSE")
  .annotate(OpenApi.Summary, "Manage SSE")
  .annotate(OpenApi.Title, "SSE")
  .prefix("/todo")
{}
