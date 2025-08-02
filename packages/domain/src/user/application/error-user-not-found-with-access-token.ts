import { HttpApiSchema } from "@effect/platform"
import { AccessToken } from "@template/domain/user/application/domain-user"
import { Schema } from "effect"

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
