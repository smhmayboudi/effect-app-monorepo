import * as expRequestResolver from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as PrimaryKey from "effect/PrimaryKey"
import * as RequestResolver from "effect/RequestResolver"
import * as Schema from "effect/Schema"
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

export const makePersonReadResolver = Effect.all([PersonConfig, PersonPortDriven]).pipe(
  Effect.flatMap(([{ cacheTTLMs }, driven]) =>
    RequestResolver.fromEffectTagged<PersonReadById>()({
      PersonReadById: (requests) =>
        driven.readByIds(requests.map((req) => req.id)).pipe(
          Effect.withSpan("PersonUseCase", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "PersonReadById", requests }
          }),
          Effect.tap(() => Effect.logDebug(`DB hit: PersonReadById ${requests.length}`))
        )
    }).pipe(
      expRequestResolver.persisted({
        storeId: "Person",
        timeToLive: (_req, exit) => Exit.isSuccess(exit) ? cacheTTLMs : 0
      })
    )
  )
)
