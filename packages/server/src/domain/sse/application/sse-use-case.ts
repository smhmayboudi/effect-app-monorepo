import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { DomainSSE } from "@template/domain/sse/application/domain-sse"
import type { UserId } from "@template/domain/user/application/domain-user"
import { PortSSEDriving } from "@template/server/domain/sse/application/port-sse-driving"
import { PortSSEManager } from "@template/server/infrastructure/application/port/sse-manager"
import type { Queue } from "effect"
import { Effect, Layer } from "effect"
import type { Scope } from "effect/Scope"

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

    const notify = (sse: DomainSSE, id: UserId): Effect.Effect<void, never, never> =>
      sseManager.notifyUser(sse, id).pipe(
        Effect.withSpan("SSEUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "notify" } })
      )

    const notifyAll = (sse: DomainSSE): Effect.Effect<void, never, never> =>
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
