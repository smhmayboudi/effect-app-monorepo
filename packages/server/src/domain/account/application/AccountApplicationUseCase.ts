import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
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

    return AccountPortDriving.of({
      create: (account) =>
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
        ),
      delete: (id) =>
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
        ),
      readAll: (urlParams) =>
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
        ),
      readById: (id) =>
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
        ),
      update: (id, account) =>
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
    })
  })
)
