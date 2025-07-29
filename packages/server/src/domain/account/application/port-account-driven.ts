import { Context, Effect } from "effect"
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { DomainAccount, AccountId } from "@template/domain/account/application/domain-account"

export class PortAccountDriven extends Context.Tag("PortAccountDriven")<PortAccountDriven, {
  create: (account: Omit<DomainAccount, "id">) => Effect.Effect<AccountId, never, never>
  delete: (id: AccountId) => Effect.Effect<void, ErrorAccountNotFound, never>
  readAll: () => Effect.Effect<DomainAccount[], never, never>
  readById: (id: AccountId) => Effect.Effect<DomainAccount, ErrorAccountNotFound, never>
  update: (id: AccountId, account: Partial<Omit<DomainAccount, "id">>) => Effect.Effect<void, ErrorAccountNotFound, never>
}>() {}
