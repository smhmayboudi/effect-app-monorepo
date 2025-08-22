import { Schema } from "effect"
import { AccountId } from "../../account/application/AccountApplicationDomain.js"

export const AccessToken = Schema.Redacted(Schema.String).pipe(
  Schema.brand("AccessToken"),
  Schema.annotations({ description: "Access Token" })
)
export type AccessToken = typeof AccessToken.Type

export const Email = Schema.String.pipe(
  Schema.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  Schema.brand("Email"),
  Schema.annotations({ description: "Email Address" })
)
export type Email = typeof Email.Type

export const UserId = Schema.UUID.pipe(
  Schema.brand("UserId"),
  Schema.annotations({ description: "User identification" })
)
export type UserId = typeof UserId.Type

export const UserSchema = Schema.Struct({
  id: UserId,
  ownerId: AccountId,
  email: Email,
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" }),
  deletedAt: Schema.NullOr(Schema.Date).annotations({ description: "Delete at" })
}).pipe(Schema.annotations({ description: "User", identifier: "User" }))
export type UserSchema = typeof UserSchema.Type

export class User extends Schema.Class<User>("User")(UserSchema) {
  static decodeUnknown = Schema.decodeUnknown(User)
}

export const UserWithSensitiveSchema = Schema.Struct({
  ...UserSchema.fields,
  accessToken: AccessToken
  // account: Account
}).pipe(Schema.annotations({ description: "UserWithSensitive", identifier: "UserWithSensitive" }))
export type UserWithSensitiveSchema = typeof UserWithSensitiveSchema.Type

export class UserWithSensitive extends Schema.Class<UserWithSensitive>(
  "UserWithSensitive"
)(UserWithSensitiveSchema) {
  static decodeUnknown = Schema.decodeUnknown(UserWithSensitive)
}
