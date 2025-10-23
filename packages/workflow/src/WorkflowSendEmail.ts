import * as Activity from "@effect/workflow/Activity"
import * as DurableClock from "@effect/workflow/DurableClock"
import * as DurableDeferred from "@effect/workflow/DurableDeferred"
import * as Workflow from "@effect/workflow/Workflow"
import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

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
    Activity.make({
      error: SendEmailError,
      execute: Activity.CurrentAttempt.pipe(
        Effect.flatMap((attempt) =>
          Effect.annotateLogs(Effect.log(`Sending email`), {
            attempt,
            executionId,
            id: payload.id
          }).pipe(
            Effect.flatMap(() => {
              if (attempt !== 5) {
                return Effect.fail(
                  new SendEmailError({
                    message: `Failed to send email for ${payload.id} on attempt ${attempt}`
                  })
                )
              }

              return Effect.void
            })
          )
        )
      ),
      name: "SendEmail"
    }).pipe(
      Activity.retry({ times: 5 }),
      WorkflowSendEmail.withCompensation(
        (_value, _cause) => Effect.log(`Compensating activity SendEmail`)
      ),
      Effect.flatMap(() =>
        Effect.log("Sleeping for 10 seconds").pipe(
          Effect.flatMap(() => DurableClock.sleep({ duration: "10 seconds", name: "Some sleep" })),
          Effect.flatMap(() => Effect.log("Woke up")),
          Effect.flatMap(() => DurableDeferred.token(DurableDeferred.make("EmailTrigger"))),
          Effect.flatMap((token) =>
            DurableDeferred.succeed(DurableDeferred.make("EmailTrigger"), { token, value: void 0 }).pipe(
              Effect.delay("1 second"),
              Effect.forkDaemon,
              Effect.flatMap(() => DurableDeferred.await(DurableDeferred.make("EmailTrigger")))
            )
          )
        )
      )
    )
)
