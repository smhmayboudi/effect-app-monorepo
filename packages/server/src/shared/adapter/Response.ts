import type { ResponseSuccess, ResponseSuccessArray, SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect } from "effect"

export const response = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<ResponseSuccess<A, E, R>, E, R> => effect.pipe(Effect.map((data) => ({ data })))

export const responseArray = <A extends Record<string, unknown>, E, R>(
  urlParams: URLParams<A>
) =>
(effect: Effect.Effect<SuccessArray<A, E, R>, E, R>): Effect.Effect<ResponseSuccessArray<A, E, R>, E, R> =>
  effect.pipe(
    Effect.map((data) => ({
      data: urlParams.fields
        ? data.data.map((item) =>
          Object.fromEntries(
            urlParams.fields!
              .filter((field) => field in item)
              .map((field) => [field, item[field as keyof A]])
          ) as Partial<A>
        )
        : data.data,
      hasMore: urlParams.limit !== undefined && urlParams.offset !== undefined
        && (urlParams.offset ?? 0) + (urlParams.limit ?? 0) < data.total,
      limit: urlParams.limit ?? 0,
      offset: urlParams.offset ?? 0,
      total: data.total
    }))
  )
