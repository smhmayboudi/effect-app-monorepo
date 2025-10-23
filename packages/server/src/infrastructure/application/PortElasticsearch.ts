import type { Client } from "@elastic/elasticsearch"
import * as Context from "effect/Context"

export class PortElasticsearch extends Context.Tag("PortElasticsearch")<PortElasticsearch, Client>() {}
