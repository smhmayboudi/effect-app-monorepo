import type { SqlClient } from "@effect/sql"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"

export const buildSelectQuery = <A extends object>(
  sql: SqlClient.SqlClient,
  tableName: string,
  urlParams: URLParams<A>
) => {
  let query = sql`SELECT * FROM ${sql(tableName)}`

  // Build WHERE clause
  if (urlParams.filters && urlParams.filters.length > 0) {
    query = sql`${query} WHERE `
    urlParams.filters.forEach((filter, index) => {
      const column = sql(filter.column.toString())

      if (Array.isArray(filter.value)) {
        // For IN clause with arrays
        const values = filter.value.map((v) => sql`${v}`)
        const valuesClause = values.reduce((acc, val, i) => i === 0 ? sql`${val}` : sql`${acc}, ${val}`)
        query = index === 0
          ? sql`${query}${column} IN (${valuesClause})`
          : sql`${query} AND ${column} IN (${valuesClause})`
      } else {
        // For single value comparison
        query = index === 0
          ? sql`${query}${column} ${sql.unsafe(filter.operator)} ${String(filter.value)}`
          : sql`${query} AND ${column} ${sql.unsafe(filter.operator)} ${String(filter.value)}`
      }
    })
  }

  // Build ORDER BY clause
  if (urlParams.sort && urlParams.sort.length > 0) {
    query = sql`${query} ORDER BY `
    urlParams.sort.forEach((sort, index) => {
      const clause = sql.unsafe(`${sort.column.toString()} ${sort.sort}`)
      query = index === 0
        ? sql`${query}${clause}`
        : sql`${query}, ${clause}`
    })
  } else {
    query = sql`${query} ORDER BY id ASC`
  }

  // Build LIMIT and OFFSET
  if (urlParams.limit !== undefined) {
    query = sql`${query} LIMIT ${urlParams.limit}`
  }
  if (urlParams.offset !== undefined) {
    query = sql`${query} OFFSET ${urlParams.offset}`
  }

  return query
}

export const buildSelectCountQuery = <A extends object>(
  sql: SqlClient.SqlClient,
  tableName: string,
  urlParams: URLParams<A>
) => {
  let query = sql<{ countId: number }>`SELECT COUNT(id) AS count_id FROM ${sql(tableName)}`

  // Build WHERE clause
  if (urlParams.filters && urlParams.filters.length > 0) {
    query = sql`${query} WHERE `
    urlParams.filters.forEach((filter, index) => {
      const column = sql(filter.column.toString())

      if (Array.isArray(filter.value)) {
        // For IN clause with arrays
        const values = filter.value.map((v) => sql`${v}`)
        const valuesClause = values.reduce((acc, val, i) => i === 0 ? sql`${val}` : sql`${acc}, ${val}`)
        query = index === 0
          ? sql`${query}${column} IN (${valuesClause})`
          : sql`${query} AND ${column} IN (${valuesClause})`
      } else {
        // For single value comparison
        query = index === 0
          ? sql`${query}${column} ${sql.unsafe(filter.operator)} ${String(filter.value)}`
          : sql`${query} AND ${column} ${sql.unsafe(filter.operator)} ${String(filter.value)}`
      }
    })
  }

  return query
}
