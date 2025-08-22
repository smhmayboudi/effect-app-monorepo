import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { Account } from "@template/domain/account/application/AccountApplicationDomain"
import { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect, Exit, Layer } from "effect"
import { PortUUID } from "../../../infrastructure/application/PortUUID.js"
import { policyRequire } from "../../../util/Policy.js"
import { AccountReadById, makeAccountReadResolver } from "./AccountApplicationCache.js"
import { AccountPortDriven } from "./AccountApplicationPortDriven.js"
import { AccountPortDriving } from "./AccountApplicationPortDriving.js"
import { AccountPortEventEmitter } from "./AccountApplicationPortEventEmitter.js"

export const AccountUseCase = Layer.scoped(
  AccountPortDriving,
  Effect.gen(function*() {
    const uuid = yield* PortUUID
    const driven = yield* AccountPortDriven
    const eventEmitter = yield* AccountPortEventEmitter
    const resolver = yield* makeAccountReadResolver

    const create = (
      account: Omit<Account, "id" | "createdAt" | "updatedAt" | "deletedAt">
    ): Effect.Effect<AccountId, never, ActorAuthorized<"Account", "create">> =>
      uuid.v7().pipe(
        Effect.flatMap((v7) =>
          driven.create({ ...account, id: AccountId.make(v7) }).pipe(
            Effect.tapBoth({
              onFailure: (out) =>
                eventEmitter.emit("AccountUseCaseCreate", {
                  in: { account: { ...account, id: AccountId.make(v7) } },
                  out: Exit.fail(out)
                }),
              onSuccess: (out) =>
                eventEmitter.emit("AccountUseCaseCreate", {
                  in: { account: { ...account, id: AccountId.make(v7) } },
                  out: Exit.succeed(out)
                })
            }),
            Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", account } }),
            policyRequire("Account", "create")
          )
        )
      )

    const del = (id: AccountId): Effect.Effect<AccountId, AccountErrorNotFound, ActorAuthorized<"Account", "delete">> =>
      driven.delete(id).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("AccountUseCaseDelete", {
              in: { id },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("AccountUseCaseDelete", {
              in: { id },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
        policyRequire("Account", "delete")
      )

    const readAll = (
      urlParams: URLParams<Account>
    ): Effect.Effect<SuccessArray<Account, never, never>, never, ActorAuthorized<"Account", "readAll">> =>
      driven.readAll(urlParams).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("AccountUseCaseReadAll", {
              in: { urlParams },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("AccountUseCaseReadAll", {
              in: { urlParams },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readlAll" } }),
        policyRequire("Account", "readAll")
      )

    const readById = (
      id: AccountId
    ): Effect.Effect<Account, AccountErrorNotFound, ActorAuthorized<"Account", "readById">> =>
      Effect.request(new AccountReadById({ id }), resolver).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("AccountUseCaseReadById", {
              in: { id },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("AccountUseCaseReadById", {
              in: { id },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
        policyRequire("Account", "readById")
      )

    const update = (
      id: AccountId,
      account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt" | "deletedAt">>
    ): Effect.Effect<AccountId, AccountErrorNotFound, ActorAuthorized<"Account", "update">> =>
      driven.update(id, account).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("AccountUseCaseUpdate", {
              in: { id, account },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("AccountUseCaseUpdate", {
              in: { id, account },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, account } }),
        policyRequire("Account", "update")
      )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
