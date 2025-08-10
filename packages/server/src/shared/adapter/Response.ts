import type { ResponseSuccess, ResponseSuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect } from "effect"

export const response = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<ResponseSuccess<A, E, R>, E, R> => effect.pipe(Effect.map((data) => ({ data })))

export const responseArray =
  <A extends Record<string, any>, E, R>(urlParams: URLParams) =>
  (effect: Effect.Effect<Array<A>, E, R>): Effect.Effect<ResponseSuccessArray<A, E, R>, E, R> =>
    effect.pipe(
      Effect.map((data) => ({
        data: urlParams.fields
          ? data.map((item) =>
            Object.fromEntries(
              urlParams.fields!
                .filter((field) => field in item)
                .map((field) => [field, item[field as keyof A]])
            ) as Partial<A>
          )
          : data,
        hasMore: false,
        limit: 1,
        offset: 0,
        total: 1
      }))
    )
