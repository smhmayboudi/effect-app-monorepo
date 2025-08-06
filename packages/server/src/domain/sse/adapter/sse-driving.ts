import { HttpApiBuilder, HttpServerResponse } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Actor } from "@template/domain/Actor"
import { Api } from "@template/domain/Api"
import { SSE } from "@template/domain/sse/application/SseApplicationDomain"
import { Effect, Queue, Schedule, Stream } from "effect"
import { PortUUID } from "../../../infrastructure/application/port-uuid.js"
import { PortSSEDriving } from "../application/port-sse-driving.js"

export const SSEDriving = HttpApiBuilder.group(Api, "sse", (handlers) =>
  Effect.gen(function*() {
    const uuid = yield* PortUUID
    const driving = yield* PortSSEDriving
    const kaStream = Stream.repeat(Effect.succeed(":keep-alive"), Schedule.fixed("3 seconds"))
    const textEncoder = new TextEncoder()

    return handlers
      .handle("connect", () =>
        Actor.pipe(
          Effect.flatMap((user) =>
            uuid.v7().pipe(
              Effect.flatMap((v7) =>
                Queue.unbounded<string>().pipe(
                  Effect.flatMap((queue) =>
                    driving.connect(v7, queue, user.id).pipe(
                      Effect.map(() => {
                        const eventsStream = Stream.fromQueue(queue).pipe(
                          Stream.map((eventString) => `data: ${eventString}`)
                        )

                        const bodyStream = Stream.merge(kaStream, eventsStream).pipe(
                          Stream.map((line) => textEncoder.encode(`${line}\n\n`))
                        )

                        return HttpServerResponse.stream(bodyStream, {
                          contentType: "text/event-stream",
                          headers: {
                            "Cache-Control": "no-cache",
                            "Connection": "keep-alive",
                            "Content-Type": "text/event-stream",
                            "X-Accel-Buffering": "no"
                          }
                        })
                      })
                    )
                  )
                )
              )
            )
          ),
          Effect.withSpan("SSEDriving", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "connect" }
          })
        ))
      .handle("notify", () =>
        Actor.pipe(
          Effect.flatMap((user) => driving.notify(new SSE({ message: `Hello ${user.email}!` }), user.id)),
          Effect.withSpan("SSEDriving", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "notify" }
          })
        ))
  }))
