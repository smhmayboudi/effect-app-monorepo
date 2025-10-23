import type { ActorId } from "@template/domain/Actor"
import type { SSE } from "@template/domain/sse/application/SSEApplicationDomain"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"
import type * as Queue from "effect/Queue"
import type * as Scope from "effect/Scope"

export class SSEPortDriving extends Context.Tag("SSEPortDriving")<SSEPortDriving, {
  connect: (
    connectionId: string,
    actorId: ActorId,
    queue: Queue.Queue<string>
  ) => Effect.Effect<
    void,
    never,
    Scope.Scope
  >
  notify: (sse: SSE, id: ActorId) => Effect.Effect<void>
  notifyAll: (sse: SSE) => Effect.Effect<void>
}>() {}
