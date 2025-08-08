import { Schema } from "effect"

export const URLParams = <S extends Schema.Schema<any>>(
  schema: S
) => {
  const KeysUnion = Schema.keyof(schema)
  const isField = (key: string) => Schema.is(KeysUnion)(key)
  const keys = Object.keys((schema as any).fields).join(", ")

  const inputSchema = Schema.Struct({
    fields: Schema.optional(Schema.String.pipe(
      Schema.filter(
        (s) => s.split(",").map((v) => v.trim()).filter(Boolean).every(isField),
        {
          description: `Fields must be a comma-separated list of: ${keys}`
        }
      ),
      Schema.annotations({
        jsonSchema: {
          description: `Comma-separated list of fields to include: ${keys}`
        }
      })
    ))
  })

  const outputSchema = Schema.Struct({
    fields: Schema.optional(Schema.Array(KeysUnion))
  })

  return Schema.transform(
    inputSchema,
    outputSchema,
    {
      decode: (fromA, _fromI) => ({
        fields: fromA.fields?.split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .filter(isField)
      }),
      encode: (toI, _toA) => ({
        fields: toI.fields?.join(",")
      }),
      strict: true
    }
  )
}
export type URLParams = Schema.Schema.Type<ReturnType<typeof URLParams>>
