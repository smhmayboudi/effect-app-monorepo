import { Schema } from "effect"

export class SSE extends Schema.Class<SSE>("SSE")({
  message: Schema.String
}) {}
