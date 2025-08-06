import { Schema } from "effect"

export const AccountId = Schema.Number.pipe(Schema.brand("AccountId"))
export type AccountId = Schema.Schema.Type<typeof AccountId>

export class DomainAccount extends Schema.Class<DomainAccount>("DomainAccount")({
  id: AccountId.annotations({ description: "Account identification" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
}) {
  static decodeUnknown = Schema.decodeUnknown(DomainAccount)
}
