import type { Client } from "@elastic/elasticsearch"
import { Context } from "effect"

export class PortElasticsearch extends Context.Tag("PortElasticsearch")<PortElasticsearch, Client>() {}
