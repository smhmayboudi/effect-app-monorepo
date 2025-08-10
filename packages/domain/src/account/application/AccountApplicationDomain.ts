import { Schema } from "effect"

export const AccountId = Schema.Number.pipe(
  Schema.brand("AccountId"),
  Schema.annotations({ description: "Account identification" })
)
export type AccountId = typeof AccountId.Type

export const AccountSchema = Schema.Struct({
  id: AccountId,
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
}).pipe(Schema.annotations({ description: "Account", identifier: "Account" }))
export type AccountSchema = typeof AccountSchema.Type

export class Account extends Schema.Class<Account>("Account")(AccountSchema) {
  static decodeUnknown = Schema.decodeUnknown(Account)
}
