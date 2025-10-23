import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class VWPortElasticsearch extends Context.Tag("VWPortElasticsearch")<VWPortElasticsearch, {
  vwGroupPersonTodo: () => Effect.Effect<void>
}>() {}
