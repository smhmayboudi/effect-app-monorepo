import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { UserGroupPerson } from "@template/domain/vw/application/UserGroupPersonApplicationDomain"
import { UserTodo } from "@template/domain/vw/application/UserTodoApplicationDomain"
import { Effect, Layer } from "effect"
import { PortElasticsearch } from "../../../infrastructure/application/PortElasticsearch.js"
import { VWPortDriven } from "../application/VWApplicationPortDriven.js"

export const VWDriven = Layer.effect(
  VWPortDriven,
  PortElasticsearch.pipe(
    Effect.flatMap((elasticsearch) =>
      Effect.sync(() =>
        VWPortDriven.of({
          readAllUserGroupPerson: (urlParams) =>
            Effect.tryPromise(() =>
              elasticsearch.search<UserGroupPerson>({
                index: "vw_user_group_person",
                query: { match_all: {} }
              })
            ).pipe(
              Effect.flatMap((userGroupPersons) =>
                Effect.all(
                  userGroupPersons.hits.hits.map((hit) => UserGroupPerson.decodeUnknown(hit._source))
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
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAllUserGroupPerson", urlParams }
              })
            ),
          readAllUserTodo: (urlParams) =>
            Effect.tryPromise(() =>
              elasticsearch.search<UserTodo>({
                index: "vw_user_todo",
                query: { match_all: {} }
              })
            ).pipe(
              Effect.flatMap((userGroupPersons) =>
                Effect.all(
                  userGroupPersons.hits.hits.map((hit) => UserTodo.decodeUnknown(hit._source))
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
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAllUserTodo", urlParams }
              })
            )
        })
      )
    )
  )
)
