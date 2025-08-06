import type { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import type { ActorAuthorized } from "@template/domain/Actor"
import { Context, type Effect } from "effect"

export class PortAccountDriving extends Context.Tag("PortAccountDriving")<PortAccountDriving, {
  create: (
    account: Omit<Account, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<AccountId, never, ActorAuthorized<"Account", "create">>
  delete: (id: AccountId) => Effect.Effect<AccountId, AccountErrorNotFound, ActorAuthorized<"Account", "delete">>
  readAll: () => Effect.Effect<Array<Account>, never, ActorAuthorized<"Account", "readAll">>
  readById: (
    id: AccountId
  ) => Effect.Effect<Account, AccountErrorNotFound, ActorAuthorized<"Account", "readById">>
  update: (
    id: AccountId,
    account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<AccountId, AccountErrorNotFound, ActorAuthorized<"Account", "update">>
}>() {}
