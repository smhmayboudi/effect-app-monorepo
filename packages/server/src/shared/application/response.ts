import { Effect } from "effect";
import { ResponseSuccess } from "@template/domain/shared/adapter/response"

export const response = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<ResponseSuccess<A>, E, R> =>
  effect.pipe(Effect.map((data) => ({ data })))
