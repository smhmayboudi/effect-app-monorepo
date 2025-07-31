import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainActor } from "@template/domain/actor"
import { AccountId } from "@template/domain/account/application/domain-account"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"
import { PortAccountPolicy } from "../application/account-policy.js"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const AccountPolicy = Layer.effect(
  PortAccountPolicy,
  Effect.gen(function* () {
    const canCreate = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "create">, ErrorActorUnauthorized, DomainActor> =>
      policy("Account", "create", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor }})
      ))

    const canDelete = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "delete">, ErrorActorUnauthorized, DomainActor> =>
      policy("Account", "delete", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor }})
      ))

    const canReadAll = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "readAll">, ErrorActorUnauthorized, DomainActor> =>
      policy("Account", "readAll", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor }})
      ))

    const canReadById = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "readById">, ErrorActorUnauthorized, DomainActor> =>
      policy("Account", "readById", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor }})
      ))

    const canUpdate = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "update">, ErrorActorUnauthorized, DomainActor> =>
      policy("Account", "update", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor }})
      ))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
