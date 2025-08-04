import { Schema } from "effect"

export class DomainSSE extends Schema.TaggedClass<DomainSSE>("DomainSSE")("DomainSSE", {
  message: Schema.String
}) {}
