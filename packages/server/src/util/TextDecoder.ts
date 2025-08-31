import { HttpApiSchema } from "@effect/platform"
import { Context, Effect, Layer, Schema } from "effect"
import { TextDecoder as TextDecoderOrg } from "node:util"

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
        const textDecoder = new TextDecoderOrg(option.encoding, option)

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
