import type { ActorId } from "@template/domain/Actor"
import type { SSE } from "@template/domain/sse/application/SSEApplicationDomain"
import { Context, type Effect, type Queue } from "effect"
import type { Scope } from "effect/Scope"

export class SSEPortDriving extends Context.Tag("SSEPortDriving")<SSEPortDriving, {
  connect: (
    connectionId: string,
    queue: Queue.Queue<string>,
    actorId: ActorId
  ) => Effect.Effect<
    void,
    never,
    Scope
  >
  notify: (sse: SSE, id: ActorId) => Effect.Effect<void>
  notifyAll: (sse: SSE) => Effect.Effect<void>
}>() {}
