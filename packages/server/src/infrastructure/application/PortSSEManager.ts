import type { ActorId } from "@template/domain/Actor"
import type { SSE } from "@template/domain/sse/application/SSEApplicationDomain"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"
import type * as Queue from "effect/Queue"

export class PortSSEManager extends Context.Tag("PortSSEManager")<PortSSEManager, {
  notifyAll: (event: SSE) => Effect.Effect<void>
  notifyUser: (event: SSE, actorId: ActorId) => Effect.Effect<void>
  registerConnection: (
    connectionId: string,
    actorId: ActorId,
    queue: Queue.Queue<string>
  ) => Effect.Effect<void>
  unregisterConnection: (connectionId: string, actorId: ActorId) => Effect.Effect<void>
}>() {}
