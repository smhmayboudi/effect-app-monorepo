import type { SSE } from "@template/domain/sse/application/SseApplicationDomain"
import type { UserId } from "@template/domain/user/application/UserApplicationDomain"
import { Context, type Effect, type Queue } from "effect"
import type { Scope } from "effect/Scope"

export class PortSSEDriving extends Context.Tag("PortSSEDriving")<PortSSEDriving, {
  connect: (
    connectionId: string,
    queue: Queue.Queue<string>,
    userId: UserId
  ) => Effect.Effect<
    void,
    never,
    Scope
  >
  notify: (sse: SSE, id: UserId) => Effect.Effect<void, never, never>
}>() {}
