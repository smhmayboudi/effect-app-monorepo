import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { AccountPortPolicy } from "../application/AccountApplicationPortPolicy.js"

const canCreate = (
  id: AccountId
): Effect.Effect<ActorAuthorized<"Account", "create">, ActorErrorUnauthorized, Actor> =>
  policy("Account", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: AccountId
): Effect.Effect<ActorAuthorized<"Account", "delete">, ActorErrorUnauthorized, Actor> =>
  policy("Account", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: AccountId
): Effect.Effect<ActorAuthorized<"Account", "readAll">, ActorErrorUnauthorized, Actor> =>
  policy("Account", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
    ))

const canReadById = (
  id: AccountId
): Effect.Effect<ActorAuthorized<"Account", "readById">, ActorErrorUnauthorized, Actor> =>
  policy("Account", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canUpdate = (
  id: AccountId
): Effect.Effect<ActorAuthorized<"Account", "update">, ActorErrorUnauthorized, Actor> =>
  policy("Account", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const AccountPolicy = Layer.effect(
  AccountPortPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadById,
    canUpdate
  }))
)
