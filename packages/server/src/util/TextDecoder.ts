import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Schema from "effect/Schema"
import * as util from "node:util"

export class TextDecoderError extends Schema.TaggedError<TextDecoderError>("TextDecoderError")(
  "TextDecoderError",
  { error: Schema.Unknown },
  HttpApiSchema.annotations({ status: 500 })
) {
}

export class PortTextDecoder extends Context.Tag("PortTextDecoder")<PortTextDecoder, {
  decode(
    input?: NodeJS.ArrayBufferView | ArrayBuffer | null,
    options?: TextDecodeOptions
  ): Effect.Effect<string, TextDecoderError>
}>() {}

export const TextDecoder = (option: {
  encoding?: string
  fatal?: boolean | undefined
  ignoreBOM?: boolean | undefined
}) =>
  Layer.effect(
    PortTextDecoder,
    Effect.try({
      try: () => {
        const textDecoder = new util.TextDecoder(option.encoding, option)

        return PortTextDecoder.of({
          decode: (input, options) =>
            Effect.try({
              try: () => textDecoder.decode(input, options),
              catch: (error) => new TextDecoderError({ error })
            })
        })
      },
      catch: (error) => new TextDecoderError({ error })
    })
  )
