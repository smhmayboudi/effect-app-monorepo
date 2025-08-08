import type { ResponseSuccess, ResponseSuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect } from "effect"

export const response = <A, E, R>(
  effect: Effect.Effect<A, E, R>
): Effect.Effect<ResponseSuccess<A>, E, R> => effect.pipe(Effect.map((data) => ({ data })))

export const responseArray =
  <A extends Record<string, any>, E, R>(urlParams: URLParams) =>
  (effect: Effect.Effect<Array<A>, E, R>): Effect.Effect<ResponseSuccessArray<A>, E, R> =>
    effect.pipe(
      Effect.map((data) => {
        if (urlParams.fields) {
          return {
            data: data.map((item) => {
              const result: Partial<A> = {}
              for (const field of urlParams.fields!) {
                if (field in item) {
                  result[field as keyof A] = item[field as keyof A]
                }
              }

              return result
            })
          }
        }
        return { data }
      })
    )
