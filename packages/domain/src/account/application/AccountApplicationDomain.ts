import { Schema } from "effect"

export const AccountId = Schema.Number.pipe(Schema.brand("AccountId"))
export type AccountId = Schema.Schema.Type<typeof AccountId>

export const AccountSchema = Schema.Struct({
  id: AccountId.annotations({ description: "Account identification" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
})
export type AccountSchema = Schema.Schema.Type<typeof AccountSchema>

export class Account extends Schema.Class<Account>("Account")(AccountSchema) {
  static decodeUnknown = Schema.decodeUnknown(Account)
}
