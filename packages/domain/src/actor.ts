import { HttpApiSchema } from "@effect/platform"
import { Effect, Predicate, Schema } from "effect"
import { DomainUser, DomainUserCurrent, UserId } from "./user/application/domain-user.js"

export class ErrorActorUnauthorized extends Schema.TaggedError<ErrorActorUnauthorized>()(
  "ErrorActorUnauthorized",
  {
    actorId: UserId,
    entity: Schema.String,
    action: Schema.String
  },
  HttpApiSchema.annotations({ status: 403 })
) {
  get message() {
    return `Actor (${this.actorId}) is not authorized to perform action "${this.action}" on entity "${this.entity}."`
  }

  static is(u: unknown): u is ErrorActorUnauthorized {
    return Predicate.isTagged(u, "UnauthorizedActor")
  }

  static refail(entity: string, action: string) {
    return <A, E, R>(
      effect: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E | ErrorActorUnauthorized, R | DomainUserCurrent> =>
      Effect.catchIf(
        effect,
        (e) => !ErrorActorUnauthorized.is(e),
        () => Effect.flatMap(
          DomainUserCurrent,
          (actor) =>
            new ErrorActorUnauthorized({
              actorId: actor.id,
              entity,
              action
            })
        )
      )
  }
}

export const TypeId: unique symbol = Symbol.for("AuthorizedActor")
export type TypeId = typeof TypeId

export interface ActorAuthorized<Entity extends string, Action extends string> extends DomainUser {
  readonly [TypeId]: {
    readonly _Entity: Entity
    readonly _Action: Action
  }
}
