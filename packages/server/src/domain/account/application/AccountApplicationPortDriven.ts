import type { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Context, type Effect } from "effect"

export class AccountPortDriven extends Context.Tag("AccountPortDriven")<AccountPortDriven, {
  create: (account: Omit<Account, "id" | "createdAt" | "updatedAt">) => Effect.Effect<AccountId>
  delete: (id: AccountId) => Effect.Effect<AccountId, AccountErrorNotFound, never>
  readAll: (urlParams: URLParams<Account>) => Effect.Effect<SuccessArray<Account, never, never>>
  readById: (id: AccountId) => Effect.Effect<Account, AccountErrorNotFound, never>
  readByIds: (ids: Array<AccountId>) => Effect.Effect<Array<Account>, AccountErrorNotFound, never>
  update: (
    id: AccountId,
    account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<AccountId, AccountErrorNotFound, never>
}>() {}
