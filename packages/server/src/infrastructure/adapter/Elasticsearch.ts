import { Client, type ClientOptions } from "@elastic/elasticsearch"
import { Effect, Layer } from "effect"
import { PortElasticsearch } from "../application/PortElasticsearch.js"

export const Elasticsearch = (opts: ClientOptions) =>
  Layer.scoped(
    PortElasticsearch,
    Effect.acquireRelease(
      Effect.sync(() => new Client(opts)),
      (client) => Effect.promise(() => client.close())
    )
  )
