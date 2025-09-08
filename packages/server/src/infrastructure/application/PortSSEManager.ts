import type { ActorId } from "@template/domain/Actor"
import type { SSE } from "@template/domain/sse/application/SSEApplicationDomain"
import { Context, type Effect, type Queue } from "effect"

export class PortSSEManager extends Context.Tag("PortSSEManager")<PortSSEManager, {
  notifyAll: (event: SSE) => Effect.Effect<void>
  notifyUser: (event: SSE, actorId: ActorId) => Effect.Effect<void>
  registerConnection: (
    connectionId: string,
    queue: Queue.Queue<string>,
    actorId: ActorId
  ) => Effect.Effect<void>
  unregisterConnection: (connectionId: string, actorId: ActorId) => Effect.Effect<void>
}>() {}
