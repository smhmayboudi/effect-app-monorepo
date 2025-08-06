// reference: https://github.com/lucas-barake/effect-monorepo/blob/main/packages/database/src/Database.ts

import type { Client as LibsqClient, LibsqlError } from "@libsql/client"
import type { ExtractTablesWithRelations } from "drizzle-orm"
import type { LibSQLDatabase, LibSQLTransaction } from "drizzle-orm/libsql"
import { Context, Data, Effect } from "effect"

export type DBSchema = Record<string, unknown>

export type TransactionClient = LibSQLTransaction<
  DBSchema,
  ExtractTablesWithRelations<DBSchema>
>

export type Client = LibSQLDatabase<DBSchema> & {
  $client: LibsqClient
}

export type TransactionContextShape = <U>(
  fn: (client: TransactionClient) => Promise<U>
) => Effect.Effect<U, DatabaseError>

export type ExecuteFn = <T>(
  fn: (client: Client | TransactionClient) => Promise<T>
) => Effect.Effect<T, DatabaseError>

export class TransactionContext extends Context.Tag("TransactionContext")<
  TransactionContext,
  TransactionContextShape
>() {
  public static readonly provide = (
    transaction: TransactionContextShape
  ): <A, E, R>(
    self: Effect.Effect<A, E, R>
  ) => Effect.Effect<A, E, Exclude<R, TransactionContext>> => Effect.provideService(this, transaction)
}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly type: "unique_violation" | "foreign_key_violation" | "connection_error"
  readonly cause: LibsqlError
}> {
  get message() {
    return this.cause.message
  }

  override toString() {
    return `DatabaseError: ${this.cause.message}`
  }
}

export class DatabaseConnectionLostError extends Data.TaggedError("DatabaseConnectionLostError")<{
  cause: unknown
  message: string
}> {}

export class PortDrizzleSqlite extends Context.Tag("PortDrizzleSqlite")<PortDrizzleSqlite, {
  execute: <T>(fn: (client: Client) => Promise<T>) => Effect.Effect.AsEffect<Effect.Effect<T, DatabaseError, never>>
  transaction: <T, E, R>(
    txExecute: (tx: TransactionContextShape) => Effect.Effect<T, E, R>
  ) => Effect.Effect.AsEffect<Effect.Effect<T, DatabaseError | E, R>>
  setupConnectionListeners: Effect.Effect<void, never, never>
  makeQuery: <A, E, R, Input = never>(
    queryFn: (execute: ExecuteFn, input: Input) => Effect.Effect<A, E, R>
  ) => (...args: [Input] extends [never] ? [] : [input: Input]) => Effect.Effect<A, E, R>
}>() {}
