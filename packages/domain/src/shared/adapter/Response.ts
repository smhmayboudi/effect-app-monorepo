import { Schema } from "effect"

export const ResponseError = Schema.Struct({
  error: Schema.Struct({
    _tag: Schema.String,
    details: Schema.optional(Schema.Unknown),
    message: Schema.String,
    status: Schema.Number
  })
})
export type ResponseError = Schema.Schema.Type<typeof ResponseError>

export const ResponseSuccess = <T extends Schema.Schema<any>>(schema: T) => Schema.Struct({ data: schema })
export type ResponseSuccess<T> = Schema.Schema.Type<ReturnType<typeof ResponseSuccess<Schema.Schema<T>>>>

export const ResponseSuccessArray = <T extends Schema.Schema<any>>(schema: T) =>
  Schema.Struct({ data: Schema.Array(Schema.partial(schema)) })
export type ResponseSuccessArray<T> = Schema.Schema.Type<ReturnType<typeof ResponseSuccessArray<Schema.Schema<T>>>>
