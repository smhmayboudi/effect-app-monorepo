import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { MiddlewareAuthentication } from "@template/domain/middleware-authentication"
import { Schema } from "effect"

export class SSEDriving extends HttpApiGroup.make("sse")
  .add(
    HttpApiEndpoint.get("connect", "/connect")
      // TODO
      .addSuccess(Schema.Unknown)
      .annotate(OpenApi.Description, "SSE connect")
      .annotate(OpenApi.Summary, "SSE connect")
      .setPayload(Schema.Struct({ text: Schema.NonEmptyTrimmedString }))
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
