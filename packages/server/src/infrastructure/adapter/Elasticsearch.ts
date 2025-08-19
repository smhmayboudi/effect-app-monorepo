import { Client, type ClientOptions } from "@elastic/elasticsearch"
import { Config, Effect, Layer } from "effect"
import { PortElasticsearch } from "../application/PortElasticsearch.js"

export const Elasticsearch = (options: Config.Config.Wrap<ClientOptions>) =>
  Layer.scoped(
    PortElasticsearch,
    Effect.acquireRelease(
      Config.unwrap(options).pipe(Effect.map((opts) => new Client(opts))),
      (client) => Effect.promise(() => client.close())
    )
  )
