import { HttpApiSchema } from "@effect/platform"
import { Context, Effect, Predicate, Schema } from "effect"
import { type User, UserId } from "./user/application/UserApplicationDomain.js"

export class Actor extends Context.Tag("Actor")<Actor, User>() {}

export const TypeId: unique symbol = Symbol.for("ActorAuthorizedId")
export type TypeId = typeof TypeId

export interface ActorAuthorized<Entity extends string, Action extends string> extends User {
  readonly [TypeId]: {
    readonly _Entity: Entity
    readonly _Action: Action
  }
}

export class ActorErrorUnauthorized extends Schema.TaggedError<ActorErrorUnauthorized>("ActorErrorUnauthorized")(
  "ActorErrorUnauthorized",
  {
    actorId: UserId,
    entity: Schema.String,
    action: Schema.String
  },
  HttpApiSchema.annotations({ status: 401 })
) {
  get message() {
    return `Actor (${this.actorId}) is not authorized to perform action "${this.action}" on entity "${this.entity}."`
  }

  static is(u: unknown): u is ActorErrorUnauthorized {
    return Predicate.isTagged(u, "ActorErrorUnauthorized")
  }

  static refail(entity: string, action: string) {
    return <A, E, R>(
      effect: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E | ActorErrorUnauthorized, R | Actor> =>
      effect.pipe(Effect.catchIf(
        (e) => !ActorErrorUnauthorized.is(e),
        () =>
          Actor.pipe(
            Effect.flatMap((actor) => new ActorErrorUnauthorized({ actorId: actor.id, entity, action }))
          )
      ))
  }
}
