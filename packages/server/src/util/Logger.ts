import { Effect } from "effect"

export const logTraceWithTrace = (...message: ReadonlyArray<unknown>) =>
  Effect.currentSpan.pipe(
    Effect.catchTag("NoSuchElementException", Effect.die),
    Effect.flatMap((span) =>
      Effect.logTrace(...message).pipe(
        Effect.annotateLogs("trace_id", span.traceId)
      )
    )
  )

export const logDebugWithTrace = (...message: ReadonlyArray<unknown>) =>
  Effect.currentSpan.pipe(
    Effect.catchTag("NoSuchElementException", Effect.die),
    Effect.flatMap((span) =>
      Effect.logDebug(...message).pipe(
        Effect.annotateLogs("trace_id", span.traceId)
      )
    )
  )

export const logInfoWithTrace = (...message: ReadonlyArray<unknown>) =>
  Effect.currentSpan.pipe(
    Effect.catchTag("NoSuchElementException", Effect.die),
    Effect.flatMap((span) =>
      Effect.logInfo(...message).pipe(
        Effect.annotateLogs("trace_id", span.traceId)
      )
    )
  )

export const logWarningWithTrace = (...message: ReadonlyArray<unknown>) =>
  Effect.currentSpan.pipe(
    Effect.catchTag("NoSuchElementException", Effect.die),
    Effect.flatMap((span) =>
      Effect.logWarning(...message).pipe(
        Effect.annotateLogs("trace_id", span.traceId)
      )
    )
  )

export const logErrorWithTrace = (...message: ReadonlyArray<unknown>) =>
  Effect.currentSpan.pipe(
    Effect.catchTag("NoSuchElementException", Effect.die),
    Effect.flatMap((span) =>
      Effect.logError(...message).pipe(
        Effect.annotateLogs("trace_id", span.traceId)
      )
    )
  )

export const logFatalWithTrace = (...message: ReadonlyArray<unknown>) =>
  Effect.currentSpan.pipe(
    Effect.catchTag("NoSuchElementException", Effect.die),
    Effect.flatMap((span) =>
      Effect.logFatal(...message).pipe(
        Effect.annotateLogs("trace_id", span.traceId)
      )
    )
  )
