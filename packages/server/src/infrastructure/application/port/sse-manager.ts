import type { DomainSSE } from "@template/domain/sse/application/domain-sse"
import type { UserId } from "@template/domain/user/application/domain-user"
import { Context, type Effect, type Queue } from "effect"

export class PortSSEManager extends Context.Tag("PortSSEManager")<PortSSEManager, {
  notifyAll: ({ event }: {
    event: DomainSSE
  }) => Effect.Effect<void, never, never>
  notifyUser: ({ event, userId }: {
    event: DomainSSE
    userId: UserId
  }) => Effect.Effect<void, never, never>
  registerConnection: ({ connectionId, queue, userId }: {
    connectionId: string
    queue: Queue.Queue<string>
    userId: UserId
  }) => Effect.Effect<void, never, never>
  unregisterConnection: ({ connectionId, userId }: {
    connectionId: string
    userId: UserId
  }) => Effect.Effect<void, never, never>
}>() {}
