import { Actor, type ActorAuthorized, ActorErrorUnauthorized, ActorId } from "@template/domain/Actor"
import type { User } from "better-auth"
import { Effect } from "effect"

const actorAuthorized = <Entity extends string, Action extends string>(
  user: User
): ActorAuthorized<Entity, Action> => user as any

export const policy = <Entity extends string, Action extends string, E, R>(
  entity: Entity,
  action: Action,
  f: (actor: User) => Effect.Effect<boolean, E, R>
): Effect.Effect<
  ActorAuthorized<Entity, Action>,
  E | ActorErrorUnauthorized,
  R | Actor
> =>
  Actor.pipe(Effect.flatMap((actor) =>
    f(actor).pipe(Effect.flatMap((can) =>
      can
        ? Effect.succeed(actorAuthorized<Entity, Action>(actor))
        : Effect.fail(new ActorErrorUnauthorized({ actorId: ActorId.make(actor.id), entity, action }))
    ))
  ))

export const policyCompose = <Actor extends ActorAuthorized<any, any>, E, R>(
  that: Effect.Effect<Actor, E, R>
) =>
<Actor2 extends ActorAuthorized<any, any>, E2, R2>(
  self: Effect.Effect<Actor2, E2, R2>
): Effect.Effect<Actor | Actor2, E | ActorErrorUnauthorized, R | Actor> => Effect.zipRight(self, that) as any

export const policyUse = <Actor extends ActorAuthorized<any, any>, E, R>(
  policy: Effect.Effect<Actor, E, R>
) =>
<A, E2, R2>(
  effect: Effect.Effect<A, E2, R2>
): Effect.Effect<A, E | E2, Exclude<R2, Actor> | R> => policy.pipe(Effect.zipRight(effect)) as any

export const policyRequire = <Entity extends string, Action extends string>(
  _entity: Entity,
  _action: Action
) =>
<A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R | ActorAuthorized<Entity, Action>> => effect

export const withSystemActor = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, Exclude<R, ActorAuthorized<any, any>>> => effect as any
