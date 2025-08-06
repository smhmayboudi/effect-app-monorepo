import { Schema } from "effect"
import { AccountId } from "../../account/application/domain-account.js"

export const AccessToken = Schema.Redacted(Schema.String).pipe(Schema.brand("AccessToken"))
export type AccessToken = Schema.Schema.Type<typeof AccessToken>

export const Email = Schema.String.pipe(
  Schema.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  Schema.brand("Email"),
  Schema.annotations({
    description: "An email address",
    title: "Email"
  })
)
export type Email = typeof Email.Type

export const UserId = Schema.Number.pipe(Schema.brand("UserId"))
export type UserId = Schema.Schema.Type<typeof UserId>

export class DomainUser extends Schema.Class<DomainUser>("DomainUser")({
  id: UserId.annotations({ description: "User identification" }),
  ownerId: AccountId.annotations({ description: "Owner identification" }),
  email: Email.annotations({ description: "Email address" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
}) {
  static decodeUnknown = Schema.decodeUnknown(DomainUser)
}

export class DomainUserWithSensitive extends Schema.Class<DomainUserWithSensitive>(
  "DomainUserWithSensitive"
)({
  ...DomainUser.fields,
  accessToken: AccessToken
  // account: DomainAccount
}) {
  static decodeUnknown = Schema.decodeUnknown(DomainUserWithSensitive)
}
