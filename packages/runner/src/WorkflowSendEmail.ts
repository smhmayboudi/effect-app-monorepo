import * as Activity from "@effect/workflow/Activity"
import * as DurableClock from "@effect/workflow/DurableClock"
import * as DurableDeferred from "@effect/workflow/DurableDeferred"
import { WorkflowSendEmail } from "@template/domain/workflow/application/WorkflowApplicationSendEmail"
import { WorkflowSendEmailError } from "@template/domain/workflow/application/WorkflowApplicationSendEmailError"
import * as Effect from "effect/Effect"

export const WorkflowSendEmailLayer = WorkflowSendEmail.toLayer(
  (payload, executionId) =>
    Activity.make({
      error: WorkflowSendEmailError,
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
                  new WorkflowSendEmailError({
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
