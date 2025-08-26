import { Activity, DurableClock, DurableDeferred, Workflow } from "@effect/workflow"
import { Effect, Schema } from "effect"

class SendEmailError extends Schema.TaggedError<SendEmailError>("SendEmailError")(
  "SendEmailError",
  { message: Schema.String }
) {}

export const WorkflowSendEmail = Workflow.make({
  error: SendEmailError,
  idempotencyKey: ({ id }) => id,
  name: "WorkflowSendEmail",
  payload: {
    id: Schema.String,
    to: Schema.String
  },
  success: Schema.Void
})

export const WorkflowSendEmailLayer = WorkflowSendEmail.toLayer(
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
        WorkflowSendEmail.withCompensation(
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
