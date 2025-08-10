import { Schema } from "effect"

export const ResponseError = Schema.Struct({
  error: Schema.Struct({
    _tag: Schema.String,
    details: Schema.optional(Schema.Unknown),
    message: Schema.String,
    status: Schema.Number
  })
})
export type ResponseError = typeof ResponseError.Type

export const ResponseSuccess = <A, E, R>(schema: Schema.Schema<A, E, R>) => Schema.Struct({ data: schema })
export type ResponseSuccess<A, E, R> = Schema.Schema.Type<ReturnType<typeof ResponseSuccess<A, E, R>>>

export const SuccessArray = <A, E, R>(schema: Schema.Schema<A, E, R>) =>
  Schema.Struct({
    data: Schema.Array(schema),
    total: Schema.Number
  })
export type SuccessArray<A, E, R> = Schema.Schema.Type<ReturnType<typeof SuccessArray<A, E, R>>>

export const ResponseSuccessArray = <A, E, R>(schema: Schema.Schema<A, E, R>) =>
  Schema.Struct({
    data: Schema.Array(Schema.partial(schema)),
    hasMore: Schema.Boolean,
    limit: Schema.Number,
    offset: Schema.Number,
    total: Schema.Number
  })
export type ResponseSuccessArray<A, E, R> = Schema.Schema.Type<ReturnType<typeof ResponseSuccessArray<A, E, R>>>
