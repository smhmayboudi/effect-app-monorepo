import * as Cause from "effect/Cause"
import * as Effect from "effect/Effect"

export const generateDataHash = (data: unknown): Effect.Effect<string, Cause.UnknownException> =>
  Effect.try(() => {
    const jsonString = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash.toString(36)
  })

export const validateDataHash = (
  data: unknown,
  existingHash: string
): Effect.Effect<void, Cause.UnknownException> =>
  generateDataHash(data).pipe(
    Effect.flatMap((currentHash) =>
      currentHash !== existingHash
        ? Effect.fail(new Cause.UnknownException("validateDataHash"))
        : Effect.void
    )
  )
