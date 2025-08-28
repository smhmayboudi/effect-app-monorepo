import { Effect } from "effect"
import { UnknownException } from "effect/Cause"

export const generateDataHash = (data: unknown): Effect.Effect<string, UnknownException> =>
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
): Effect.Effect<void, UnknownException> =>
  generateDataHash(data).pipe(
    Effect.flatMap((currentHash) =>
      currentHash !== existingHash
        ? Effect.fail(new UnknownException("validateDataHash"))
        : Effect.void
    )
  )
