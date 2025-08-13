import { HttpApiGroup, OpenApi } from "@effect/platform"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"

export class AccountDriving extends HttpApiGroup.make("account")
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Account")
  .annotate(OpenApi.Summary, "Manage Account")
  .annotate(OpenApi.Title, "Account")
  .prefix("/account")
{}
