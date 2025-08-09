import { Schema } from "effect"

export const SSESchema = Schema.Struct({
  message: Schema.String
})
export type SSESchema = Schema.Schema.Type<typeof SSESchema>

export class SSE extends Schema.Class<SSE>("SSE")(SSESchema) {
  static decodeUnknown = Schema.decodeUnknown(SSE)
}
