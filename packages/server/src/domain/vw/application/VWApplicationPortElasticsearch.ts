import type { Effect } from "effect"
import { Context } from "effect"

export class VWPortElasticsearch extends Context.Tag("VWPortElasticsearch")<VWPortElasticsearch, {
  vwUserGroupPerson: () => Effect.Effect<void>
  vwUserTodo: () => Effect.Effect<void>
}>() {}
