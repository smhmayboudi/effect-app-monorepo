import type { AccountId, DomainAccount } from "@template/domain/account/application/domain-account"
import type { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { Context, type Effect } from "effect"

export class PortAccountDriven extends Context.Tag("PortAccountDriven")<PortAccountDriven, {
  create: (account: Omit<DomainAccount, "id" | "createdAt" | "updatedAt">) => Effect.Effect<AccountId, never, never>
  delete: (id: AccountId) => Effect.Effect<void, ErrorAccountNotFound, never>
  readAll: () => Effect.Effect<Array<DomainAccount>, never, never>
  readById: (id: AccountId) => Effect.Effect<DomainAccount, ErrorAccountNotFound, never>
  update: (
    id: AccountId,
    account: Partial<Omit<DomainAccount, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<void, ErrorAccountNotFound, never>
}>() {}
