import { Command } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { Effect, Layer } from "effect"
import { ServicePortEventEmitter } from "../application/ServiceApplicationPortEventEmitter.js"

export const runCommands = (serviceId: ServiceId) => {
  const generate = Command.make("pnpm --filter ./packages/server exec drizzle-kit generate").pipe(
    Command.env({ SERVER_SERVICE_ID: serviceId }),
    Command.runInShell(true)
  )
  const migrate = Command.make("pnpm --filter ./packages/server exec drizzle-kit migrate").pipe(
    Command.env({ SERVER_SERVICE_ID: serviceId }),
    Command.runInShell(true)
  )
  const push = Command.make("pnpm --filter ./packages/server exec drizzle-kit push").pipe(
    Command.env({ SERVER_SERVICE_ID: serviceId }),
    Command.runInShell(true)
  )

  return Effect.all([
    Command.string(generate).pipe(Effect.provide(NodeContext.layer), Effect.logDebug),
    Command.string(migrate).pipe(Effect.provide(NodeContext.layer), Effect.logDebug),
    Command.string(push).pipe(Effect.provide(NodeContext.layer), Effect.logDebug)
  ], { concurrency: 1 })
}

export const ServiceEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    ServicePortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("ServiceUseCaseCreate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseCreate", ...data })
            .pipe(
              Effect.andThen(() =>
                data.out.pipe(
                  Effect.flatMap(runCommands),
                  Effect.catchTag("ServiceErrorAlreadyExists", Effect.logError)
                )
              )
            )),
        eventEmitter.on("ServiceUseCaseDelete", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseDelete", ...data })),
        eventEmitter.on("ServiceUseCaseReadAll", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseReadAll", ...data })),
        eventEmitter.on("ServiceUseCaseReadById", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseReadById", ...data })),
        eventEmitter.on("ServiceUseCaseUpdate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseUpdate", ...data }))
      ], { concurrency: "unbounded" })
  )
)
