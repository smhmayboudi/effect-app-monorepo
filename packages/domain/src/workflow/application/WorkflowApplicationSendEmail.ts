import * as Workflow from "@effect/workflow/Workflow"
import * as Schema from "effect/Schema"
import { WorkflowSendEmailError } from "./WorkflowApplicationSendEmailError.js"

export const WorkflowSendEmail = Workflow.make({
  error: WorkflowSendEmailError,
  idempotencyKey: ({ id }) => id,
  name: "WorkflowSendEmail",
  payload: {
    id: Schema.String,
    to: Schema.String
  },
  success: Schema.Void
})
