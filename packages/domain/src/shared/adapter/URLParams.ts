import * as Schema from "effect/Schema"

export const ComparisonOperators = [
  "!=",
  "<>",
  "<",
  "<=",
  "=",
  ">",
  ">="
] as const
export type ComparisonOperators = (typeof ComparisonOperators)[number]

export const URLParams = <A extends object>(schema: Schema.Schema<A, any>) => {
  const KeysUnion = Schema.keyof(schema)
  type KeysUnion = typeof KeysUnion.Type
  const isKeysUnion = (key: unknown): key is KeysUnion => Schema.is(KeysUnion)(key)
  const typeAst = Schema.typeSchema(schema).ast
  let keys = ""
  if (typeAst._tag === "TypeLiteral") {
    keys = typeAst.propertySignatures.map((ps) => ps.name).join(", ")
  }
  const isValidFilterCondition = (condition: string): boolean => {
    const parts = condition.split(":")
    if (parts.length !== 3) {
      return false
    }
    const [field, operator, value] = parts
    if (!field || field.trim() === "" || !isKeysUnion(field.trim())) {
      return false
    }
    if (!operator || !ComparisonOperators.includes(operator.trim() as ComparisonOperators)) {
      return false
    }
    if (!value || value.trim() === "") {
      return false
    }
    return true
  }
  const isValidFiltersString = (filters: string): boolean => {
    const conditions = filters.split(",").map((v) => v.trim()).filter(Boolean)

    return (conditions.length === 0) ?
      false :
      conditions.every(isValidFilterCondition)
  }

  const inputSchema = Schema.Struct({
    expands: Schema.optionalWith(
      Schema.NonEmptyTrimmedString.pipe(
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
      Schema.NonEmptyTrimmedString.pipe(
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
    filters: Schema.optionalWith(
      Schema.NonEmptyTrimmedString.pipe(
        Schema.filter(
          isValidFiltersString,
          {
            description: `Filters must be in format "field:operator:value" with comma separation. Valid operators: ${
              ComparisonOperators.join(", ")
            }`,
            identifier: "FiltersValidator"
          }
        ),
        Schema.annotations({
          jsonSchema: {
            description: `Comma separated filter conditions in format: field:operator:value. Supported operators: ${
              ComparisonOperators.join(", ")
            }`
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
      Schema.NonEmptyTrimmedString.pipe(
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
    filters: Schema.optionalWith(
      Schema.Array(Schema.Struct({
        column: KeysUnion,
        operator: Schema.Literal(...ComparisonOperators),
        value: Schema.Union(
          Schema.Array(Schema.Number),
          Schema.Array(Schema.String),
          Schema.Boolean,
          Schema.Number,
          Schema.String
        )
      })),
      { exact: true }
    ),
    limit: Schema.optionalWith(Schema.Number, { exact: true }),
    offset: Schema.optionalWith(Schema.Number, { exact: true }),
    sort: Schema.optionalWith(
      Schema.Array(Schema.Struct({
        column: KeysUnion,
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
        ...(fromA.filters && {
          filters: fromA.filters.split(",")
            .map((v) => v.trim())
            .filter(Boolean)
            .map((v) => {
              const parts = v.split(":")
              const [field, operator, value] = parts

              return {
                column: field.trim() as KeysUnion,
                operator: operator.trim() as ComparisonOperators,
                value: value.trim()
              }
            })
        }),
        ...(fromA.limit !== undefined && { limit: fromA.limit }),
        ...(fromA.offset !== undefined && { offset: fromA.offset }),
        ...(fromA.sort && {
          sort: fromA.sort.split(",").map((v) => ({
            column: v.replace(/^-/, "") as KeysUnion,
            sort: v.includes("-") ? "DESC" as const : "ASC" as const
          }))
        })
      }),
      encode: (toI) => ({
        ...(toI.expands && { expands: toI.expands.join(",") }),
        ...(toI.fields && { fields: toI.fields.join(",") }),
        ...(toI.filters &&
          { filters: toI.filters.map((v) => `${String(v.column)}:${v.operator}:${v.value}`).join(",") }),
        ...(toI.limit !== undefined && { limit: toI.limit }),
        ...(toI.offset !== undefined && { offset: toI.offset }),
        ...(toI.sort && {
          sort: toI.sort.map((v) => `${v.sort === "DESC" ? "-" : ""}${String(v.column)}`).join(",")
        })
      }),
      strict: true
    }
  )
}
export type URLParams<A extends object> = Schema.Schema.Type<ReturnType<typeof URLParams<A>>>
