import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"
import { ResponseSuccessArray } from "../../shared/adapter/Response.js"
import { URLParams } from "../../shared/adapter/URLParams.js"
import { UserGroupPersonSchema } from "../application/UserGroupPersonApplicationDomain.js"
import { UserTodoSchema } from "../application/UserTodoApplicationDomain.js"

export class VWDriving extends HttpApiGroup.make("vw")
  .add(
    HttpApiEndpoint.get("readAllUserGroupPerson", "/UserGroupPerson/")
      .addSuccess(ResponseSuccessArray(UserGroupPersonSchema))
      .setUrlParams(URLParams(UserGroupPersonSchema))
      .annotate(OpenApi.Description, "UserGroupPerson readAll")
      .annotate(OpenApi.Summary, "UserGroupPerson readAll")
  )
  .add(
    HttpApiEndpoint.get("readAllUserTodo", "/UserTodo/")
      .addSuccess(ResponseSuccessArray(UserTodoSchema))
      .setUrlParams(URLParams(UserTodoSchema))
      .annotate(OpenApi.Description, "UserTodo readAll")
      .annotate(OpenApi.Summary, "UserTodo readAll")
  )
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage VW")
  .annotate(OpenApi.Summary, "Manage VW")
  .annotate(OpenApi.Title, "VW")
  .prefix("/vw")
{}
