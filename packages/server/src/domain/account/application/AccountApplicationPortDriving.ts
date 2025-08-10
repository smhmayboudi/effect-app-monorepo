import type { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Context, type Effect } from "effect"

export class AccountPortDriving extends Context.Tag("AccountPortDriving")<AccountPortDriving, {
  create: (
    account: Omit<Account, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<AccountId, never, ActorAuthorized<"Account", "create">>
  delete: (id: AccountId) => Effect.Effect<AccountId, AccountErrorNotFound, ActorAuthorized<"Account", "delete">>
  readAll: (
    urlParams: URLParams<Account>
  ) => Effect.Effect<Array<Account>, never, ActorAuthorized<"Account", "readAll">>
  readById: (
    id: AccountId
  ) => Effect.Effect<Account, AccountErrorNotFound, ActorAuthorized<"Account", "readById">>
  update: (
    id: AccountId,
    account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<AccountId, AccountErrorNotFound, ActorAuthorized<"Account", "update">>
}>() {}
