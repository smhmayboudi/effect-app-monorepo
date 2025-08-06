import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { AccessToken } from "./UserApplicationDomain.js"

export class UserErrorNotFoundWithAccessToken
  extends Schema.TaggedError<UserErrorNotFoundWithAccessToken>("UserErrorNotFoundWithAccessToken")(
    "UserErrorNotFoundWithAccessToken",
    { accessToken: AccessToken },
    HttpApiSchema.annotations({ status: 404 })
  )
{
  get message() {
    return `${this.accessToken} not found.`
  }
}
