import { Context, Effect } from "effect"
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { DomainAccount, AccountId } from "@template/domain/account/application/domain-account"
import { ActorAuthorized } from "@template/domain/actor"

export class PortAccountDriving extends Context.Tag("PortAccountDriving")<PortAccountDriving, {
  create: (account: Omit<DomainAccount, "id" | "createdAt" | "updatedAt">) => Effect.Effect<AccountId, never, ActorAuthorized<"Account", "create">>
  delete: (id: AccountId) => Effect.Effect<AccountId, ErrorAccountNotFound, ActorAuthorized<"Account", "delete">>
  readAll: () => Effect.Effect<DomainAccount[], never, ActorAuthorized<"Account", "readAll">>
  readById: (id: AccountId) => Effect.Effect<DomainAccount, ErrorAccountNotFound, ActorAuthorized<"Account", "readById">>
  update: (id: AccountId, account: Partial<Omit<DomainAccount, "id">>) => Effect.Effect<AccountId, ErrorAccountNotFound, ActorAuthorized<"Account", "update">>
}>() {}
