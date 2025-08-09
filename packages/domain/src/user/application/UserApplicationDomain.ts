import { Schema } from "effect"
import { AccountId } from "../../account/application/AccountApplicationDomain.js"

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

export const UserSchema = Schema.Struct({
  id: UserId.annotations({ description: "User identification" }),
  ownerId: AccountId.annotations({ description: "Owner identification" }),
  email: Email.annotations({ description: "Email address" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
})
export type UserSchema = Schema.Schema.Type<typeof UserSchema>

export class User extends Schema.Class<User>("User")(UserSchema) {
  static decodeUnknown = Schema.decodeUnknown(User)
}

export const UserWithSensitiveSchema = Schema.Struct({
  ...User.fields,
  accessToken: AccessToken
  // account: Account
})
export type UserWithSensitiveSchema = Schema.Schema.Type<typeof UserWithSensitiveSchema>

export class UserWithSensitive extends Schema.Class<UserWithSensitive>(
  "UserWithSensitive"
)(UserWithSensitiveSchema) {
  static decodeUnknown = Schema.decodeUnknown(UserWithSensitive)
}
