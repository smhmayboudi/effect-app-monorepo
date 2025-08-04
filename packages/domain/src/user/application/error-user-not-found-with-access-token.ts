import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { AccessToken } from "./domain-user.js"

export class ErrorUserNotFoundWithAccessToken
  extends Schema.TaggedError<ErrorUserNotFoundWithAccessToken>("ErrorUserNotFoundWithAccessToken")(
    "ErrorUserNotFoundWithAccessToken",
    { accessToken: AccessToken },
    HttpApiSchema.annotations({ status: 404 })
  )
{
  get message() {
    return `${this.accessToken} not found.`
  }
}
