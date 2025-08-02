import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { AccessToken } from "@template/domain/user/application/domain-user"

export class ErrorUserNotFoundWithAccessToken extends Schema.TaggedError<ErrorUserNotFoundWithAccessToken>("ErrorUserNotFoundWithAccessToken")(
  "ErrorUserNotFoundWithAccessToken",
  { accessToken: AccessToken },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.accessToken} not found.`
  }
}
