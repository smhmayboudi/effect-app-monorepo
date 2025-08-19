import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { UserGroupPerson } from "@template/domain/vw/application/UserGroupPersonApplicationDomain"
import { UserTodo } from "@template/domain/vw/application/UserTodoApplicationDomain"
import { Effect, Layer } from "effect"
import { PortElasticsearch } from "../../../infrastructure/application/PortElasticsearch.js"
import { VWPortDriven } from "../application/VWApplicationPortDriven.js"

export const VWDriven = Layer.effect(
  VWPortDriven,
  Effect.gen(function*() {
    const elasticsearch = yield* PortElasticsearch

    const readAllUserGroupPerson = (
      urlParams: URLParams<UserGroupPerson>
    ): Effect.Effect<SuccessArray<UserGroupPerson, never, never>, never, never> =>
      Effect.tryPromise(() =>
        elasticsearch.search<UserGroupPerson>({
          index: "user_group_person",
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    fields: ["person_first_name"],
                    query: "TODO: data.query"
                  }
                }
              ]
            }
          }
        })
      ).pipe(
        Effect.flatMap((userGroupPersons) =>
          Effect.all(
            userGroupPersons.hits.hits.map((userGroupPerson) => UserGroupPerson.decodeUnknown(userGroupPerson))
          )
            .pipe(
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
      )

    const readAllUserTodo = (
      urlParams: URLParams<UserTodo>
    ): Effect.Effect<SuccessArray<UserTodo, never, never>, never, never> =>
      Effect.tryPromise(() =>
        elasticsearch.search<UserTodo>({
          index: "user_todo",
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    fields: ["person_first_name"],
                    query: "TODO: data.query"
                  }
                }
              ]
            }
          }
        })
      ).pipe(
        Effect.flatMap((userGroupPersons) =>
          Effect.all(
            userGroupPersons.hits.hits.map((userGroupPerson) => UserTodo.decodeUnknown(userGroupPerson))
          )
            .pipe(
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

    return {
      readAllUserGroupPerson,
      readAllUserTodo
    } as const
  })
)
