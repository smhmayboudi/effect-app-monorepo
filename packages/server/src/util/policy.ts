import { Effect } from "effect"
import { DomainUser } from "@template/domain/user/application/domain-user"
import { DomainActor } from "@template/domain/actor"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

const actorAuthorized = <Entity extends string, Action extends string>(
  user: DomainUser
): ActorAuthorized<Entity, Action> => user as any

export const policy = <Entity extends string, Action extends string, E, R>(
  entity: Entity,
  action: Action,
  f: (actor: DomainUser) => Effect.Effect<boolean, E, R>
): Effect.Effect<
  ActorAuthorized<Entity, Action>,
  E | ErrorActorUnauthorized,
  R | DomainActor
> =>
  Effect.flatMap(DomainActor, (actor) =>
    Effect.flatMap(f(actor), (can) =>
      can
        ? Effect.succeed(actorAuthorized<Entity, Action>(actor))
        : Effect.fail(new ErrorActorUnauthorized({ actorId: actor.id, entity, action }))))

export const policyCompose = <Actor extends ActorAuthorized<any, any>, E, R>(
  that: Effect.Effect<Actor, E, R>
) =>
<Actor2 extends ActorAuthorized<any, any>, E2, R2>(
  self: Effect.Effect<Actor2, E2, R2>
): Effect.Effect<Actor | Actor2, E | ErrorActorUnauthorized, R | DomainActor> => Effect.zipRight(self, that) as any

export const policyUse = <Actor extends ActorAuthorized<any, any>, E, R>(
  policy: Effect.Effect<Actor, E, R>
) => <A, E2, R2>(
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
