import { HttpApiGroup, OpenApi } from "@effect/platform"

export class AccountDriving extends HttpApiGroup.make("account")
  .prefix("/account")
  .annotate(OpenApi.Description, "Manage Account")
  .annotate(OpenApi.Title, "Account")
{}
