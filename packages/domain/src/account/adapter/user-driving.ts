import { HttpApiGroup, OpenApi } from "@effect/platform"
import { MiddlewareAuthentication } from "../../middleware-authentication.js";

export class AccountDriving extends HttpApiGroup.make("account")
  .annotate(OpenApi.Description, "Manage Account")
  .annotate(OpenApi.Title, "Account")
  .middlewareEndpoints(MiddlewareAuthentication)
  .prefix("/account")
{}
