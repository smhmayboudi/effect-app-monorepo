import type { Effect } from "effect"
import { Context } from "effect"

export class VWPortElasticsearch extends Context.Tag("VWPortElasticsearch")<VWPortElasticsearch, {
  vwUserGroupPerson: () => Effect.Effect<void, never, never>
  vwUserTodo: () => Effect.Effect<void, never, never>
}>() {}
