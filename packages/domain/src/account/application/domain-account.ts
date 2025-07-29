import { Schema } from "effect"

export const AccountId = Schema.Number.pipe(Schema.brand("AccountId"))
export type AccountId = Schema.Schema.Type<typeof AccountId>

export class DomainAccount extends Schema.Class<DomainAccount>("DomainAccount")({
  id: AccountId,
  createdAt: Schema.Date,
  updatedAt: Schema.Date
}) {
  static decodeUknown = Schema.decodeUnknown(DomainAccount)
}
