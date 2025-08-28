import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { AccessToken, UserId } from "@template/domain/user/application/UserApplicationDomain"
import { WorkflowSendEmail } from "@template/workflow/WorkflowSendEmail"
import { Effect, Exit, Layer, Redacted } from "effect"
import { PortUUID } from "../../../infrastructure/application/PortUUID.js"
import { policyRequire } from "../../../util/Policy.js"
import { AccountPortDriving } from "../../account/application/AccountApplicationPortDriving.js"
import { makeUserReadResolver, UserReadByAccessToken, UserReadById } from "./UserApplicationCache.js"
import { UserPortDriven } from "./UserApplicationPortDriven.js"
import { UserPortDriving } from "./UserApplicationPortDriving.js"
import { UserPortEventEmitter } from "./UserApplicationPortEventEmitter.js"

export const UserUseCase = Layer.scoped(
  UserPortDriving,
  Effect.all([PortUUID, UserPortDriven, UserPortEventEmitter, makeUserReadResolver, AccountPortDriving]).pipe(
    Effect.flatMap(([uuid, driven, eventEmitter, resolver, account]) =>
      Effect.sync(() => {
        const readByIdWithSensitive = (id: UserId) =>
          driven.readByIdWithSensitive(id).pipe(
            Effect.tapBoth({
              onFailure: (out) =>
                eventEmitter.emit("UserUseCaseReadByIdWithSensitive", {
                  in: { id },
                  out: Exit.fail(out)
                }),
              onSuccess: (out) =>
                eventEmitter.emit("UserUseCaseReadByIdWithSensitive", {
                  in: { id },
                  out: Exit.succeed(out)
                })
            }),
            Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id } }),
            policyRequire("User", "readByIdWithSensitive")
          )

        return UserPortDriving.of({
          create: (user) =>
            account.create({}).pipe(
              Effect.flatMap((accountId) =>
                Effect.all([uuid.v7(), uuid.v7()], { concurrency: 2 }).pipe(
                  Effect.flatMap((v7) =>
                    driven.create({
                      ...user,
                      accessToken: AccessToken.make(Redacted.make(v7[0])),
                      ownerId: accountId,
                      id: UserId.make(v7[1])
                    }).pipe(
                      Effect.onError(() => account.delete(accountId).pipe(Effect.ignore)),
                      Effect.flatMap((userId) => readByIdWithSensitive(userId)),
                      Effect.tapBoth({
                        onFailure: (out) =>
                          eventEmitter.emit("UserUseCaseCreate", {
                            in: { user: { ...user, ownerId: accountId, id: UserId.make(v7[1]) } },
                            out: Exit.fail(out)
                          }),
                        onSuccess: (out) =>
                          eventEmitter.emit("UserUseCaseCreate", {
                            in: { user: { ...user, ownerId: accountId, id: UserId.make(v7[1]) } },
                            out: Exit.succeed(out)
                          })
                      }),
                      Effect.tap((out) => WorkflowSendEmail.execute({ id: out.id, to: out.email }, { discard: true })),
                      Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", user } }),
                      policyRequire("User", "create")
                    )
                  )
                )
              )
            ),
          delete: (id) =>
            driven.delete(id).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("UserUseCaseDelete", {
                    in: { id },
                    out: Exit.fail(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("UserUseCaseDelete", {
                    in: { id },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
              policyRequire("User", "delete")
            ),
          readAll: (urlParams) =>
            driven.readAll(urlParams).pipe(
              Effect.tap((out) =>
                eventEmitter.emit("UserUseCaseReadAll", {
                  in: { urlParams },
                  out: Exit.succeed(out)
                })
              ),
              Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
              policyRequire("User", "readAll")
            ),
          readByAccessToken: (accessToken) =>
            Effect.request(new UserReadByAccessToken({ accessToken }), resolver).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("UserUseCaseReadByAccessToken", {
                    in: { accessToken },
                    out: Exit.fail(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("UserUseCaseReadByAccessToken", {
                    in: { accessToken },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("UserUseCase", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByAccessToken", accessToken }
              }),
              policyRequire("User", "readByAccessToken")
            ),
          readById: (id) =>
            Effect.request(new UserReadById({ id }), resolver).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("UserUseCaseReadById", {
                    in: { id },
                    out: Exit.fail(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("UserUseCaseReadById", {
                    in: { id },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
              policyRequire("User", "readById")
            ),
          readByIdWithSensitive,
          update: (id, user) =>
            driven.update(id, user).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("UserUseCaseUpdate", {
                    in: { id, user },
                    out: Exit.fail(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("UserUseCaseUpdate", {
                    in: { id, user },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, user } }),
              policyRequire("User", "update")
            )
        })
      })
    )
  )
)
