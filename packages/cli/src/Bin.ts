#!/usr/bin/env node

import * as NodeContext from "@effect/platform-node/NodeContext"
import * as NodeHttpClient from "@effect/platform-node/NodeHttpClient"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { cli } from "./Cli.js"
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
