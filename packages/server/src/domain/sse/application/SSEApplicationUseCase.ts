import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { PortSSEManager } from "../../../infrastructure/application/PortSSEManager.js"
import { SSEPortDriving } from "./SSEApplicationPortDriving.js"

export const SSEUseCase = Layer.effect(
  SSEPortDriving,
  PortSSEManager.pipe(
    Effect.flatMap((sseManager) =>
      Effect.sync(() =>
        SSEPortDriving.of({
          connect: (connectionId, queue, actorId) =>
            sseManager.registerConnection(connectionId, queue, actorId).pipe(
              Effect.flatMap(() => Effect.addFinalizer(() => sseManager.unregisterConnection(connectionId, actorId))),
              Effect.withSpan("SSEUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "connect" } })
            ),
          notify: (sse, id) =>
            sseManager.notifyUser(sse, id).pipe(
              Effect.withSpan("SSEUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "notify" } })
            ),
          notifyAll: (sse) =>
            sseManager.notifyAll(sse).pipe(
              Effect.withSpan("SSEUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "notifyAll" } })
            )
        })
      )
    )
  )
)
