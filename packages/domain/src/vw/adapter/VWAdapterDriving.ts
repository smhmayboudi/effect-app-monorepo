import * as HttpApiEndpoint from "@effect/platform/HttpApiEndpoint"
import * as HttpApiGroup from "@effect/platform/HttpApiGroup"
import * as OpenApi from "@effect/platform/OpenApi"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"
import { ResponseSuccessArray } from "../../shared/adapter/Response.js"
import { URLParams } from "../../shared/adapter/URLParams.js"
import { GroupPersonTodoSchema } from "../application/GroupPersonTodoApplicationDomain.js"

export class VWDriving extends HttpApiGroup.make("vw")
  .add(
    HttpApiEndpoint.get("readAllGroupPersonTodo", "/GroupPersonTodo/")
      .addSuccess(ResponseSuccessArray(GroupPersonTodoSchema))
      .setUrlParams(URLParams(GroupPersonTodoSchema))
      .annotate(OpenApi.Description, "GroupPersonTodo readAll")
      .annotate(OpenApi.Summary, "GroupPersonTodo readAll")
  )
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage VW")
  .annotate(OpenApi.Summary, "Manage VW")
  .annotate(OpenApi.Title, "VW")
  .prefix("/vw")
{}
