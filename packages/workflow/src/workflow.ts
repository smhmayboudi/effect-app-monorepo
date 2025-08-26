import { ClusterWorkflowEngine } from "@effect/cluster"
import { NodeClusterRunnerSocket, NodeRuntime } from "@effect/platform-node"
import { SqliteClient } from "@effect/sql-sqlite-node"
import { Activity, DurableClock, DurableDeferred, Workflow } from "@effect/workflow"
import { Effect, Layer, Logger, LogLevel, Schema, String } from "effect"

class SendEmailError extends Schema.TaggedError<SendEmailError>("SendEmailError")(
  "SendEmailError",
  { message: Schema.String }
) {}

const EmailWorkflow = Workflow.make({
  error: SendEmailError,
  idempotencyKey: ({ id }) => id,
  name: "EmailWorkflow",
  payload: {
    id: Schema.String,
    to: Schema.String
  },
  success: Schema.Void
})

const SqlLayer = SqliteClient.layer({
  filename: "./db-workflow.sqlite",
  transformQueryNames: String.camelToSnake,
  transformResultNames: String.snakeToCamel
})

const RunnerLive = NodeClusterRunnerSocket.layer({
  clientOnly: false,
  storage: "sql"
})

const EmailWorkflowLayer = EmailWorkflow.toLayer(
  (payload, executionId) =>
    Effect.gen(function*() {
      yield* Activity.make({
        error: SendEmailError,
        execute: Effect.gen(function*() {
          const attempt = yield* Activity.CurrentAttempt
          yield* Effect.annotateLogs(Effect.log(`Sending email`), {
            attempt,
            executionId,
            id: payload.id
          })
          if (attempt !== 5) {
            return yield* new SendEmailError({
              message: `Failed to send email for ${payload.id} on attempt ${attempt}`
            })
          }
        }),
        name: "SendEmail"
      }).pipe(
        Activity.retry({ times: 5 }),
        EmailWorkflow.withCompensation(
          (_value, _cause) =>
            Effect.gen(function*() {
              yield* Effect.log(`Compensating activity SendEmail`)
            })
        )
      )
      yield* Effect.log("Sleeping for 10 seconds")
      yield* DurableClock.sleep({ duration: "10 seconds", name: "Some sleep" })
      yield* Effect.log("Woke up")
      const EmailTrigger = DurableDeferred.make("EmailTrigger")
      const token = yield* DurableDeferred.token(EmailTrigger)
      yield* DurableDeferred.succeed(EmailTrigger, { token, value: void 0 }).pipe(
        Effect.delay("1 second"),
        Effect.forkDaemon
      )
      yield* DurableDeferred.await(EmailTrigger)
    })
)

const WorkflowEngineLayer = ClusterWorkflowEngine.layer.pipe(
  Layer.provideMerge(RunnerLive),
  Layer.provideMerge(SqlLayer)
)

const EnvLayer = Layer.mergeAll(
  EmailWorkflowLayer,
  Logger.minimumLogLevel(LogLevel.Debug)
).pipe(
  Layer.provide(WorkflowEngineLayer)
)

EmailWorkflow.execute({ id: "123", to: "hello@timsmart.co" }).pipe(
  Effect.provide(EnvLayer),
  NodeRuntime.runMain
)
