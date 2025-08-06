import type { SSE } from "@template/domain/sse/application/SSEApplicationDomain"
import type { UserId } from "@template/domain/user/application/UserApplicationDomain"
import { Context, type Effect, type Queue } from "effect"

export class PortSSEManager extends Context.Tag("PortSSEManager")<PortSSEManager, {
  notifyAll: (event: SSE) => Effect.Effect<void, never, never>
  notifyUser: (event: SSE, userId: UserId) => Effect.Effect<void, never, never>
  registerConnection: (
    connectionId: string,
    queue: Queue.Queue<string>,
    userId: UserId
  ) => Effect.Effect<void, never, never>
  unregisterConnection: (connectionId: string, userId: UserId) => Effect.Effect<void, never, never>
}>() {}
