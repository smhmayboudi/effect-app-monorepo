import * as Schema from "effect/Schema"

export const SSESchema = Schema.Struct({
  message: Schema.String
}).pipe(Schema.annotations({ description: "SSE", identifier: "SSE" }))
export type SSESchema = typeof SSESchema.Type

export class SSE extends Schema.Class<SSE>("SSE")(SSESchema) {
  static decodeUnknown = Schema.decodeUnknown(SSE)
}
