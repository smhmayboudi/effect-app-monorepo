import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { PortSSEManager } from "../../../infrastructure/application/PortSSEManager.js"
import { SSEPortDriving } from "./SSEApplicationPortDriving.js"

export const SSEUseCase = Layer.scoped(
  SSEPortDriving,
  PortSSEManager.pipe(
    Effect.andThen((sseManager) =>
      SSEPortDriving.of({
        connect: (connectionId, actorId, queue) =>
          sseManager.registerConnection(connectionId, actorId, queue).pipe(
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
