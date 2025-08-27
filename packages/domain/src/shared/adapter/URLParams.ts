import { Schema } from "effect"

export const URLParams = <A>(schema: Schema.Schema<A, any>) => {
  const KeysUnion = Schema.keyof(schema)
  type KeysUnion = typeof KeysUnion.Type
  const isKeysUnion = (key: unknown): key is KeysUnion => Schema.is(KeysUnion)(key)
  const keys = Object.keys((schema as any).fields).join(", ")

  const inputSchema = Schema.Struct({
    expands: Schema.optionalWith(
      Schema.String.pipe(
        Schema.filter(
          (a) => a.split(",").map((v) => v.trim()).filter(Boolean).every(isKeysUnion),
          { description: `Fields must be a comma-separated list of: ${keys}`, identifier: "ExpandsFilter" }
        ),
        Schema.annotations({
          jsonSchema: { description: "Auto expand record relations" }
        })
      ),
      { exact: true }
    ),
    fields: Schema.optionalWith(
      Schema.String.pipe(
        Schema.filter(
          (a) => a.split(",").map((v) => v.trim()).filter(Boolean).every(isKeysUnion),
          { description: `Fields must be a comma-separated list of: ${keys}`, identifier: "FieldsFilter" }
        ),
        Schema.annotations({
          jsonSchema: {
            description:
              "Comma separated string of the fields to return in the JSON response (by default returns all fields)"
          }
        })
      ),
      { exact: true }
    ),
    limit: Schema.optionalWith(
      Schema.NumberFromString.pipe(
        Schema.greaterThan(0),
        Schema.lessThanOrEqualTo(20),
        Schema.annotations({
          description: "The max returned records per request"
        })
      ),
      { exact: true }
    ),
    offset: Schema.optionalWith(
      Schema.NumberFromString.pipe(
        Schema.greaterThanOrEqualTo(0),
        Schema.annotations({
          description: "The offset returned records per request"
        })
      ),
      { exact: true }
    ),
    sort: Schema.optionalWith(
      Schema.String.pipe(
        Schema.filter(
          (a) => a.split(",").map((v) => v.trim().replace(/^-/, "")).filter(Boolean).every(isKeysUnion),
          {
            description: `Sort must be a comma-separated list of fields (optionally prefixed with '-'): ${keys}`,
            identifier: "SortFilter"
          }
        ),
        Schema.annotations({
          jsonSchema: {
            description:
              "Specify the ORDER BY fields, add - / + (default) in front of the attribute for DESC / ASC order"
          }
        })
      ),
      { exact: true }
    )
  })

  const outputSchema = Schema.Struct({
    expands: Schema.optionalWith(Schema.Array(KeysUnion), { exact: true }),
    fields: Schema.optionalWith(Schema.Array(KeysUnion), { exact: true }),
    limit: Schema.optionalWith(Schema.Number, { exact: true }),
    offset: Schema.optionalWith(Schema.Number, { exact: true }),
    sort: Schema.optionalWith(
      Schema.Array(Schema.Struct({
        by: KeysUnion,
        sort: Schema.Literal("ASC", "DESC")
      })),
      { exact: true }
    )
  })

  return Schema.transform(
    inputSchema,
    outputSchema,
    {
      decode: (fromA) => ({
        ...(fromA.expands && {
          expands: fromA.expands.split(",")
            .map((v) => v.trim())
            .filter(Boolean)
            .filter(isKeysUnion)
            .map((v) => v as KeysUnion)
        }),
        ...(fromA.fields && {
          fields: fromA.fields.split(",")
            .map((v) => v.trim())
            .filter(Boolean)
            .filter(isKeysUnion)
            .map((v) => v as KeysUnion)
        }),
        ...(fromA.limit !== undefined && { limit: fromA.limit }),
        ...(fromA.offset !== undefined && { offset: fromA.offset }),
        ...(fromA.sort && {
          sort: fromA.sort.split(",").map((v) => ({
            by: v.replace(/^-/, "") as KeysUnion,
            sort: v.includes("-") ? "DESC" as const : "ASC" as const
          }))
        })
      }),
      encode: (toI) => ({
        ...(toI.expands && { expands: toI.expands.join(",") }),
        ...(toI.fields && { fields: toI.fields.join(",") }),
        ...(toI.limit !== undefined && { limit: toI.limit }),
        ...(toI.offset !== undefined && { offset: toI.offset }),
        ...(toI.sort && {
          sort: toI.sort.map((v) => `${v.sort === "DESC" ? "-" : ""}${String(v.by)}`).join(",")
        })
      }),
      strict: true
    }
  )
}
export type URLParams<A> = Schema.Schema.Type<ReturnType<typeof URLParams<A>>>
