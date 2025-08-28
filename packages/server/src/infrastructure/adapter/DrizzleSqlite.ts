// reference: https://github.com/lucas-barake/effect-monorepo/blob/main/packages/database/src/Database.ts

import { createClient, type LibsqlError } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { Cause, Effect, Exit, Layer, Option, Redacted, Runtime } from "effect"
import type {
  Client,
  DBSchema,
  ExecuteFn,
  TransactionClient,
  TransactionContextShape
} from "../application/PortDrizzleSqlite.js"
import {
  DatabaseError,
  DatabaseErrorConnectionLost,
  PortDrizzleSqlite,
  TransactionContext
} from "../application/PortDrizzleSqlite.js"

const matchLibSQLError = (error: unknown) => {
  if (error instanceof Error && error.name === "LibsqlError") {
    const e = error as LibsqlError
    switch (e.code) {
      case "SQLITE_CONSTRAINT_UNIQUE":
        return new DatabaseError({ type: "unique_violation", cause: e })
      case "SQLITE_CONSTRAINT_FOREIGNKEY":
        return new DatabaseError({ type: "foreign_key_violation", cause: e })
      case "SQLITE_CONNECTION_FAILED":
      case "SQLITE_NETWORK":
        return new DatabaseError({ type: "connection_error", cause: e })
    }
  }
  return null
}

export type Config = {
  authToken?: Redacted.Redacted
  dbSchema: DBSchema
  url: Redacted.Redacted
}

export const drizzleSqlite = (config: Config) =>
  Layer.scoped(
    PortDrizzleSqlite,
    Effect.acquireRelease(
      Effect.sync(() =>
        createClient({
          ...(config.authToken && { authToken: Redacted.value(config.authToken) }),
          url: Redacted.value(config.url)
        })
      ),
      (client) => Effect.sync(() => client.close())
    ).pipe(
      Effect.flatMap((client) =>
        Effect.tryPromise(() => client.execute("SELECT 1")).pipe(
          Effect.timeoutFail({
            duration: "10 seconds",
            onTimeout: () =>
              new DatabaseErrorConnectionLost({
                cause: new Error("[Database] Failed to connect: timeout"),
                message: "[Database] Failed to connect: timeout"
              })
          }),
          Effect.catchTag(
            "UnknownException",
            (error) =>
              new DatabaseErrorConnectionLost({
                cause: error.cause,
                message: "[Database] Failed to connect"
              })
          ),
          Effect.tap(() => Effect.logInfo("[Database client]: Connection to the database established.")),
          Effect.map(() => client)
        )
      ),
      Effect.map((client) => {
        const db = drizzle(client, { schema: config.dbSchema })

        const execute = <A>(fn: (client: Client) => Promise<A>) =>
          Effect.tryPromise({
            try: () => fn(db),
            catch: (cause) => {
              const error = matchLibSQLError(cause)
              if (error !== null) {
                return error
              }
              throw cause
            }
          })

        return PortDrizzleSqlite.of({
          execute,
          makeQuery: <A, E, R, Input = never>(
            queryFn: (execute: ExecuteFn, input: Input) => Effect.Effect<A, E, R>
          ) =>
          (...args: [Input] extends [never] ? [] : [input: Input]): Effect.Effect<A, E, R> =>
            Effect.serviceOption(TransactionContext).pipe(
              Effect.map(Option.getOrNull),
              Effect.flatMap((txOrNull) => queryFn(txOrNull ?? execute, args[0] as Input))
            ),
          setupConnectionListeners: Effect.logInfo(
            "[Database client]: libsql has no persistent connection; listeners skipped."
          ),
          transaction: <A, E, R>(txExecute: (tx: TransactionContextShape) => Effect.Effect<A, E, R>) =>
            Effect.runtime<R>().pipe(
              Effect.map((runtime) => Runtime.runPromiseExit(runtime)),
              Effect.flatMap((runPromiseExit) =>
                Effect.async<A, DatabaseError | E, R>((resume) => {
                  db.transaction(async (tx: TransactionClient) => {
                    const txWrapper = (fn: (client: TransactionClient) => Promise<any>) =>
                      Effect.tryPromise({
                        try: () => fn(tx),
                        catch: (cause) => {
                          const error = matchLibSQLError(cause)
                          if (error !== null) {
                            return error
                          }
                          throw cause
                        }
                      })
                    const result = await runPromiseExit(txExecute(txWrapper))
                    Exit.match(result, {
                      onSuccess: (value) => resume(Effect.succeed(value)),
                      onFailure: (cause) =>
                        Cause.isFailure(cause)
                          ? resume(Effect.fail(Cause.originalError(cause) as E))
                          : resume(Effect.die(cause))
                    })
                  }).catch((cause) => {
                    const error = matchLibSQLError(cause)
                    resume(error ? Effect.fail(error) : Effect.die(cause))
                  })
                })
              )
            )
        })
      })
    )
  )
