import { Client, type ClientOptions } from "@elastic/elasticsearch"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { PortElasticsearch } from "../application/PortElasticsearch.js"

export const Elasticsearch = (options: Config.Config.Wrap<ClientOptions>) =>
  Layer.scoped(
    PortElasticsearch,
    Effect.acquireRelease(
      Config.unwrap(options).pipe(Effect.map((opts) => new Client(opts))),
      (client) => Effect.promise(() => client.close())
    )
  )
