import * as HttpApiEndpoint from "@effect/platform/HttpApiEndpoint"
import * as HttpApiGroup from "@effect/platform/HttpApiGroup"
import * as OpenApi from "@effect/platform/OpenApi"
import * as Schema from "effect/Schema"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"

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
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage SSE")
  .annotate(OpenApi.Summary, "Manage SSE")
  .annotate(OpenApi.Title, "SSE")
  .prefix("/sse")
{}
