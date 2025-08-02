import { HttpApiGroup, OpenApi } from "@effect/platform"
import { MiddlewareAuthentication } from "@template/domain/middleware-authentication"

export class AccountDriving extends HttpApiGroup.make("account")
  .middlewareEndpoints(MiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Account")
  .annotate(OpenApi.Summary, "Manage Account")
  .annotate(OpenApi.Title, "Account")
  .prefix("/account")
{}
