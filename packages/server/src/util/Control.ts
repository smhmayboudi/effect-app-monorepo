// reference: https://github.com/lucas-barake/building-an-app-with-effect/blob/main/packages/domain/src/control.ts

import * as Effect from "effect/Effect"
import * as Function from "effect/Function"

/**
 * Runs a prerequisite effect before the main effect.
 * The result of the prerequisite effect is discarded, and the result of the main effect is returned.
 * This is equivalent to `Effect.zipRight(prerequisite, self)`.
 */
export const pre: {
  <A2, E2, R2>(
    prerequisite: Effect.Effect<A2, E2, R2>
  ): <A, E, R>(self: Effect.Effect<A, E, R>) => Effect.Effect<A, E | E2, R | R2>
  <A, E, R, B, E2, R2>(
    self: Effect.Effect<A, E, R>,
    prerequisite: Effect.Effect<B, E2, R2>
  ): Effect.Effect<A, E | E2, R | R2>
} = Function.dual(
  2,
  <A, E, R, A2, E2, R2>(
    self: Effect.Effect<A, E, R>,
    prerequisite: Effect.Effect<A2, E2, R2>
  ): Effect.Effect<A, E | E2, R | R2> => Effect.zipRight(prerequisite, self)
)

/**
 * Conditionally executes an effect based on a boolean condition.
 * If the condition is false, fails with the provided error.
 * Useful for enforcing preconditions before executing effects.
 */
export const whenOrFail: {
  <A, E, R, E2>(
    condition: Function.LazyArg<boolean>,
    orFailWith: Function.LazyArg<E2>
  ): (self: Effect.Effect<A, E, R>) => Effect.Effect<A, E | E2, R>
  <A, E, R, E2>(
    self: Effect.Effect<A, E, R>,
    condition: Function.LazyArg<boolean>,
    orFailWith: Function.LazyArg<E2>
  ): Effect.Effect<A, E | E2, R>
} = Function.dual(
  3,
  <A, E, R, E2>(
    self: Effect.Effect<A, E, R>,
    condition: Function.LazyArg<boolean>,
    orFailWith: Function.LazyArg<E2>
  ): Effect.Effect<A, E | E2, R> =>
    // At runtime, Effect.fail short-circuits execution, so the success type is actually just A when the condition is true.
    Effect.sync(condition).pipe(
      Effect.flatMap((bool): Effect.Effect<A, E | E2, R> => bool ? self : Effect.fail(orFailWith()))
    )
)

/**
 * Similar to `whenOrFail` but accepts an effectful condition that may fail.
 * Executes the main effect only if the condition effect resolves to true,
 * otherwise fails with the provided error.
 */
export const whenEffectOrFail: {
  <E2, R2, E3>(
    condition: Effect.Effect<boolean, E2, R2>,
    orFailWith: Function.LazyArg<E3>
  ): <A, E, R>(self: Effect.Effect<A, E, R>) => Effect.Effect<A, E | E2 | E3, R | R2>
  <A, E, R, E2, R2, E3>(
    self: Effect.Effect<A, E, R>,
    condition: Effect.Effect<boolean, E2, R2>,
    orFailWith: Function.LazyArg<E3>
  ): Effect.Effect<A, E | E2 | E3, R | R2>
} = Function.dual(
  3,
  <A, E, R, E2, R2, E3>(
    self: Effect.Effect<A, E, R>,
    condition: Effect.Effect<boolean, E2, R2>,
    orFailWith: Function.LazyArg<E3>
  ): Effect.Effect<A, E | E2 | E3, R | R2> =>
    // At runtime, Effect.fail short-circuits execution, so the success type is actually just A when the condition is true.
    Effect.flatMap(condition, (bool): Effect.Effect<A, E | E3, R> => bool ? self : Effect.fail(orFailWith()))
)
