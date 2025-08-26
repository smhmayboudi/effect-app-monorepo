import { ClusterSchema, Entity, RunnerAddress } from "@effect/cluster"
import { DevTools } from "@effect/experimental"
import { NodeClusterRunnerSocket, NodeClusterShardManagerSocket, NodeRuntime } from "@effect/platform-node"
import { Rpc } from "@effect/rpc"
import { SqliteClient } from "@effect/sql-sqlite-node"
import { Duration, Effect, Layer, Logger, LogLevel, Option, Schema } from "effect"

// SHARE DATA

const SqlLayer = SqliteClient.layer({
  filename: "./db-workflow.sqlite"
})

const HelloWorld = Entity.make("HelloWorld", [
  Rpc.make("SayHi", {
    payload: {
      target: Schema.String
    },
    success: Schema.Struct({
      result: Schema.String,
      send: Schema.String
    }),
    error: Schema.Never
  })
]).annotateRpcs(ClusterSchema.Persisted, true)

// APP 1, Manager: Manage Tasks

const ShardManagerLive = NodeClusterShardManagerSocket.layer({ storage: "sql" })

const shardManager = ShardManagerLive.pipe(
  Layer.provide(SqlLayer),
  Layer.launch
)

// APP 2, Runner: Execute Tasks

const RunnerLive = NodeClusterRunnerSocket.layer({
  clientOnly: false,
  storage: "sql",
  shardingConfig: {
    runnerAddress: Option.some(
      RunnerAddress.make("127.0.0.1", 51010)
    ),
    runnerListenAddress: Option.some(
      RunnerAddress.make("127.0.0.1", 51010)
    )
  }
})

const HelloWorldLive = HelloWorld.toLayer(
  Effect.gen(function*() {
    const address = yield* Entity.CurrentAddress

    return {
      SayHi: Effect.fnUntraced(
        function*(envelope) {
          return yield* Effect.succeed({
            result: `Hello, ${envelope.payload.target}!`,
            send: address.entityId
          })
        }
      )
    }
  })
)

const runner = HelloWorldLive.pipe(
  Layer.provide(Layer.mergeAll(RunnerLive, SqlLayer)),
  Layer.launch
)

// APP 3, Client: Create Tasks

const ClientLive = NodeClusterRunnerSocket.layer({
  clientOnly: true,
  storage: "sql"
})

const client = Effect.gen(function*() {
  const client = yield* HelloWorld.client

  yield* Effect.logInfo("Executing client call")

  yield* client("00000000-0000-0000-0000-000000000000").SayHi({ target: "World" }).pipe(
    Effect.tap((result) => Effect.logInfo("Received result", result))
  )
}).pipe(
  Effect.timeout(Duration.seconds(3)),
  Effect.provide(Layer.mergeAll(ClientLive))
)

// APP 4, Run All

const program = Effect.gen(function*() {
  yield* shardManager.pipe(Effect.forkScoped)
  yield* runner.pipe(Effect.forkScoped)
  yield* Effect.sleep(1000)
  yield* client
})

program.pipe(
  Effect.scoped,
  Effect.provide(Layer.mergeAll(
    DevTools.layer(),
    Logger.minimumLogLevel(LogLevel.Debug),
    SqlLayer
  )),
  NodeRuntime.runMain
)
