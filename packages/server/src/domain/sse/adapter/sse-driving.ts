import { HttpApiBuilder, HttpServerResponse } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { DomainActor } from "@template/domain/actor"
import { Api } from "@template/domain/api"
import { DomainSSE } from "@template/domain/sse/application/domain-sse"
import { Effect, Queue, Schedule, Stream } from "effect"
import { PortUUID } from "../../../infrastructure/application/port/uuid.js"
import { PortSSEDriving } from "../application/port-sse-driving.js"

export const SSEDriving = HttpApiBuilder.group(Api, "sse", (handlers) =>
  Effect.gen(function*() {
    const uuid = yield* PortUUID
    const driving = yield* PortSSEDriving
    const kaStream = Stream.repeat(Effect.succeed(":keep-alive"), Schedule.fixed("3 seconds"))
    const textEncoder = new TextEncoder()

    return handlers
      .handle("connect", () =>
        DomainActor.pipe(
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
        DomainActor.pipe(
          Effect.flatMap((user) => driving.notify(new DomainSSE({ message: `Hello ${user.email}!` }), user.id)),
          Effect.withSpan("SSEDriving", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "notify" }
          })
        ))
  }))
