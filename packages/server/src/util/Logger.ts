import * as Array from "effect/Array"
import * as Inspectable from "effect/Inspectable"
import * as Logger from "effect/Logger"
import * as Option from "effect/Option"
import * as Record from "effect/Record"

export const LoggerLive = Logger.replace(
  Logger.defaultLogger,
  Logger.structuredLogger.pipe(
    Logger.map((q) => {
      const [messages, attributes] = Array.partition(
        Array.isArray(q.message) ? q.message : [],
        (message) =>
          typeof message === "object" &&
          message !== null &&
          Object.getPrototypeOf(message) === Object.prototype
      )

      return Inspectable.stringifyCircular({
        level: q.logLevel,
        timestamp: q.timestamp,
        cause: q.cause,
        dd: {
          trace_id: Option.getOrNull(Record.get(q.annotations, "effect.traceId")),
          span_id: Option.getOrNull(Record.get(q.annotations, "effect.spanId"))
        },
        message: [...messages, q.cause].join(" ").trim(),
        ...Object.assign({}, ...attributes)
      })
    }),
    Logger.withSpanAnnotations,
    Logger.withConsoleLog
  )
)
