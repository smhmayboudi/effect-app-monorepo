import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { GroupPersonTodo } from "@template/domain/vw/application/GroupPersonTodoApplicationDomain"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { PortElasticsearch } from "../../../infrastructure/application/PortElasticsearch.js"
import { VWPortDriven } from "../application/VWApplicationPortDriven.js"

export const VWDriven = Layer.effect(
  VWPortDriven,
  PortElasticsearch.pipe(
    Effect.flatMap((elasticsearch) =>
      Effect.sync(() =>
        VWPortDriven.of({
          readAllGroupPersonTodo: (urlParams) =>
            Effect.tryPromise(() =>
              elasticsearch.search<GroupPersonTodo>({
                index: "vw_group_person_todo",
                query: { match_all: {} }
              })
            ).pipe(
              Effect.flatMap((userGroupPersons) =>
                Effect.all(
                  userGroupPersons.hits.hits.map((hit) => GroupPersonTodo.decodeUnknown(hit._source))
                ).pipe(
                  Effect.map((data) => ({
                    data,
                    total: typeof userGroupPersons.hits.total === "number"
                      ? userGroupPersons.hits.total
                      : userGroupPersons.hits.total?.value ?? 0
                  }))
                )
              ),
              Effect.catchTag("ParseError", Effect.die),
              Effect.catchTag("UnknownException", Effect.die),
              Effect.withSpan("VWDriven", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAllGroupPersonTodo", urlParams }
              })
            )
        })
      )
    )
  )
)
