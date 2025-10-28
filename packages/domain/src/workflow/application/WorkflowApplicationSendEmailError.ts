import * as Schema from "effect/Schema"

export class WorkflowSendEmailError extends Schema.TaggedError<WorkflowSendEmailError>("WorkflowSendEmailError")(
  "WorkflowSendEmailError",
  { message: Schema.String }
) {}
