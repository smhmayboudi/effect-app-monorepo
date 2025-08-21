import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { SSE } from "@template/domain/sse/application/SSEApplicationDomain"
import type { UserId } from "@template/domain/user/application/UserApplicationDomain"
import type { Queue } from "effect"
import { Effect, Layer } from "effect"
import type { Scope } from "effect/Scope"
import { PortSSEManager } from "../../../infrastructure/application/PortSSEManager.js"
import { SSEPortDriving } from "./SSEApplicationPortDriving.js"

export const SSEUseCase = Layer.effect(
  SSEPortDriving,
  Effect.gen(function*() {
    const sseManager = yield* PortSSEManager

    const connect = (
      connectionId: string,
      queue: Queue.Queue<string>,
      userId: UserId
    ): Effect.Effect<void, never, Scope> =>
      sseManager.registerConnection(connectionId, queue, userId).pipe(
        Effect.flatMap(() => Effect.addFinalizer(() => sseManager.unregisterConnection(connectionId, userId))),
        Effect.withSpan("SSEUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "connect" } })
      )

    const notify = (sse: SSE, id: UserId): Effect.Effect<void> =>
      sseManager.notifyUser(sse, id).pipe(
        Effect.withSpan("SSEUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "notify" } })
      )

    const notifyAll = (sse: SSE): Effect.Effect<void> =>
      sseManager.notifyAll(sse).pipe(
        Effect.withSpan("SSEUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "notifyAll" } })
      )

    return {
      connect,
      notify,
      notifyAll
    } as const
  })
)
