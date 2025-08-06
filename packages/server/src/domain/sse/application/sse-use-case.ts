import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { SSE } from "@template/domain/sse/application/SseApplicationDomain"
import type { UserId } from "@template/domain/user/application/UserApplicationDomain"
import type { Queue } from "effect"
import { Effect, Layer } from "effect"
import type { Scope } from "effect/Scope"
import { PortSSEManager } from "../../../infrastructure/application/port-sse-manager.js"
import { PortSSEDriving } from "./port-sse-driving.js"

export const SSEUseCase = Layer.effect(
  PortSSEDriving,
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

    const notify = (sse: SSE, id: UserId): Effect.Effect<void, never, never> =>
      sseManager.notifyUser(sse, id).pipe(
        Effect.withSpan("SSEUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "notify" } })
      )

    const notifyAll = (sse: SSE): Effect.Effect<void, never, never> =>
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
