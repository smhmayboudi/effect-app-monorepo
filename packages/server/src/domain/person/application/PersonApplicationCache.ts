import { persisted } from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import { Effect, Exit, PrimaryKey, RequestResolver, Schema } from "effect"
import { logDebugWithTrace } from "../../../util/Logger.js"
import { PersonConfig } from "./PersonApplicationConfig.js"
import { PersonPortDriven } from "./PersonApplicationPortDriven.js"

export class PersonReadById extends Schema.TaggedRequest<PersonReadById>("PersonReadById")("PersonReadById", {
  failure: PersonErrorNotFound,
  payload: { id: PersonId },
  success: Person
}) {
  [PrimaryKey.symbol]() {
    return `PersonReadById:${this.id}`
  }
}

export const makePersonReadResolver = Effect.gen(function*() {
  const { cacheTTLMs } = yield* PersonConfig
  const driven = yield* PersonPortDriven
  const resolver = yield* RequestResolver.fromEffectTagged<PersonReadById>()({
    PersonReadById: (requests) =>
      driven.readByIds(requests.map((req) => req.id)).pipe(
        Effect.withSpan("PersonUseCase", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "PersonReadById", requests }
        }),
        Effect.tap(() => logDebugWithTrace(`DB hit: PersonReadById ${requests.length}`))
      )
  }).pipe(
    persisted({
      storeId: "Person",
      timeToLive: (_req, exit) => Exit.isSuccess(exit) ? cacheTTLMs : 0
    })
  )

  return resolver
})
