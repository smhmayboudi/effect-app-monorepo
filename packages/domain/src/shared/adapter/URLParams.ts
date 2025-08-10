import { Schema } from "effect"

export const URLParams = <S extends Schema.Schema<any>>(schema: S) => {
  const KeysUnion = Schema.keyof(schema)
  const isField = (key: string) => Schema.is(KeysUnion)(key)
  const keys = Object.keys((schema as any).fields).join(", ")

  const inputSchema = Schema.Struct({
    expands: Schema.optional(Schema.String.pipe(
      Schema.filter(
        (s) => s.split(",").map((v) => v.trim()).filter(Boolean).every(isField),
        {
          description: `Fields must be a comma-separated list of: ${keys}`
        }
      ),
      Schema.annotations({
        jsonSchema: {
          description: "Auto expand record relations"
        }
      })
    )),
    fields: Schema.optional(Schema.String.pipe(
      Schema.filter(
        (s) => s.split(",").map((v) => v.trim()).filter(Boolean).every(isField),
        {
          description: `Fields must be a comma-separated list of: ${keys}`
        }
      ),
      Schema.annotations({
        jsonSchema: {
          description:
            "Comma separated string of the fields to return in the JSON response (by default returns all fields)"
        }
      })
    )),
    limit: Schema.optional(Schema.NumberFromString.pipe(
      Schema.greaterThan(0),
      Schema.lessThanOrEqualTo(20),
      Schema.annotations({
        description: "The max returned records per request"
      })
    )),
    offset: Schema.optional(Schema.NumberFromString.pipe(
      Schema.greaterThanOrEqualTo(0),
      Schema.annotations({
        description: "The offset returned records per request"
      })
    )),
    sort: Schema.optional(Schema.String.pipe(
      Schema.filter(
        (s) => s.split(",").map((v) => v.trim().replace(/^-/, "")).filter(Boolean).every(isField),
        {
          description: `Sort must be a comma-separated list of fields (optionally prefixed with '-'): ${keys}`
        }
      ),
      Schema.annotations({
        jsonSchema: {
          description: "Specify the ORDER BY fields, add - / + (default) in front of the attribute for DESC / ASC order"
        }
      })
    ))
  })

  const outputSchema = Schema.Struct({
    expands: Schema.optional(Schema.Array(KeysUnion)),
    fields: Schema.optional(Schema.Array(KeysUnion)),
    limit: Schema.optional(Schema.Number),
    offset: Schema.optional(Schema.Number),
    sort: Schema.optional(Schema.Array(Schema.Struct({
      by: KeysUnion,
      sort: Schema.Literal("ASC", "DESC")
    })))
  })

  return Schema.transform(
    inputSchema,
    outputSchema,
    {
      decode: (fromA, _fromI) => ({
        expands: fromA.expands?.split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .filter(isField),
        fields: fromA.fields?.split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .filter(isField),
        limit: fromA.limit,
        offset: fromA.offset,
        sort: fromA.sort?.split(",").map((v) => ({
          by: v.replace(/^-/, ""),
          sort: v.includes("-") ? "DESC" as const : "ASC" as const
        }))
      }),
      encode: (toI, _toA) => ({
        expands: toI.expands?.join(","),
        fields: toI.fields?.join(","),
        limit: toI.limit,
        offset: toI.offset,
        sort: toI.sort?.map((v) => `${v.sort === "DESC" ? "-" : ""}${String(v.by)}`).join(",")
      }),
      strict: true
    }
  )
}
export type URLParams = Schema.Schema.Type<ReturnType<typeof URLParams>>
