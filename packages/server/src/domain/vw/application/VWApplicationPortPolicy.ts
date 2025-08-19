import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import { Context, type Effect } from "effect"

export class VWPortPolicy extends Context.Tag("VWPortPolicy")<VWPortPolicy, {
  canReadAllUserGroupPerson: () => Effect.Effect<
    ActorAuthorized<"VW", "readAllUserGroupPerson">,
    ActorErrorUnauthorized,
    Actor
  >
  canReadAllUserTodo: () => Effect.Effect<ActorAuthorized<"VW", "readAllUserTodo">, ActorErrorUnauthorized, Actor>
}>() {}
