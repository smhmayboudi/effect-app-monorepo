import type { DomainSSE } from "@template/domain/sse/application/domain-sse"
import type { UserId } from "@template/domain/user/application/domain-user"
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
  notify: (sse: DomainSSE, id: UserId) => Effect.Effect<void, never, never>
}>() {}
