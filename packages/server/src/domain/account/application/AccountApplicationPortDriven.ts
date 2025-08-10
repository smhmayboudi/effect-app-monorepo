import type { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Context, type Effect } from "effect"

export class AccountPortDriven extends Context.Tag("AccountPortDriven")<AccountPortDriven, {
  create: (account: Omit<Account, "id" | "createdAt" | "updatedAt">) => Effect.Effect<AccountId, never, never>
  delete: (id: AccountId) => Effect.Effect<AccountId, AccountErrorNotFound, never>
  readAll: (urlParams: URLParams<Account>) => Effect.Effect<Array<Account>, never, never>
  readById: (id: AccountId) => Effect.Effect<Account, AccountErrorNotFound, never>
  update: (
    id: AccountId,
    account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<AccountId, AccountErrorNotFound, never>
}>() {}
