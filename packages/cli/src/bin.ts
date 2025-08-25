#!/usr/bin/env node

import { NodeContext, NodeHttpClient, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { cli } from "./cli.js"
import { TodoClient, UUID } from "./TodoClient.js"

const Bin = TodoClient.pipe(
  Layer.provide(UUID),
  Layer.provide(NodeHttpClient.layerUndici),
  Layer.merge(NodeContext.layer)
)

Effect.suspend(() => cli(process.argv)).pipe(
  Effect.provide(Bin),
  NodeRuntime.runMain
)
