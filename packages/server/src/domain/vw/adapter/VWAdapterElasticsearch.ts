import * as SqlClient from "@effect/sql/SqlClient"
import { ActorId } from "@template/domain/Actor"
import { GroupId, GroupSchema } from "@template/domain/group/application/GroupApplicationDomain"
import { PersonId, PersonSchema } from "@template/domain/person/application/PersonApplicationDomain"
import { TodoId, TodoSchema } from "@template/domain/todo/application/TodoApplicationDomain"
import { Effect, Layer, Schema } from "effect"
import { PortElasticsearch } from "../../../infrastructure/application/PortElasticsearch.js"
import { VWPortElasticsearch } from "../application/VWApplicationPortElasticsearch.js"

const GroupPersonTodoSchema = () => {
  const inputSchema = Schema.Struct({
    groupId: GroupSchema.fields.id,
    groupOwnerId: GroupSchema.fields.ownerId,
    groupName: GroupSchema.fields.name,
    groupCreatedAt: Schema.String,
    groupUpdatedAt: Schema.String,
    personId: PersonSchema.fields.id,
    personGroupId: PersonSchema.fields.groupId,
    personBirthday: Schema.String,
    personFirstName: PersonSchema.fields.firstName,
    personLastName: PersonSchema.fields.lastName,
    personCreatedAt: Schema.String,
    personUpdatedAt: Schema.String,
    todoId: TodoSchema.fields.id,
    todoOwnerId: TodoSchema.fields.ownerId,
    todoDone: TodoSchema.fields.done,
    todoText: TodoSchema.fields.text,
    todoCreatedAt: Schema.String,
    todoUpdatedAt: Schema.String
  })

  const outputSchema = Schema.Struct({
    group: GroupSchema,
    person: PersonSchema,
    todo: TodoSchema
  })

  return Schema.transform(
    inputSchema,
    outputSchema,
    {
      decode: (fromA) => ({
        group: {
          id: fromA.groupId,
          ownerId: fromA.groupOwnerId,
          name: fromA.groupName,
          createdAt: fromA.groupCreatedAt,
          updatedAt: fromA.groupUpdatedAt,
          deletedAt: null
        },
        person: {
          id: fromA.personId,
          groupId: fromA.personGroupId,
          birthday: fromA.personBirthday,
          firstName: fromA.personFirstName,
          lastName: fromA.personLastName,
          createdAt: fromA.personCreatedAt,
          updatedAt: fromA.personUpdatedAt,
          deletedAt: null
        },
        todo: {
          id: fromA.todoId,
          ownerId: fromA.todoOwnerId,
          done: fromA.todoDone,
          text: fromA.todoText,
          createdAt: fromA.todoCreatedAt,
          updatedAt: fromA.todoUpdatedAt,
          deletedAt: null
        }
      }),
      encode: (toI) => ({
        groupId: GroupId.make(toI.group.id),
        groupOwnerId: ActorId.make(toI.group.ownerId),
        groupName: toI.group.name,
        groupCreatedAt: toI.group.createdAt,
        groupUpdatedAt: toI.group.updatedAt,
        personId: PersonId.make(toI.person.id),
        personGroupId: GroupId.make(toI.person.groupId),
        personBirthday: toI.person.birthday,
        personFirstName: toI.person.firstName,
        personLastName: toI.person.lastName,
        personCreatedAt: toI.person.createdAt,
        personUpdatedAt: toI.person.updatedAt,
        todoId: TodoId.make(toI.todo.id),
        todoOwnerId: ActorId.make(toI.todo.ownerId),
        todoDone: toI.todo.done,
        todoText: toI.todo.text,
        todoCreatedAt: toI.todo.createdAt,
        todoUpdatedAt: toI.todo.updatedAt
      }),
      strict: true
    }
  )
}
type GroupPersonTodoSchema = Schema.Schema.Type<ReturnType<typeof GroupPersonTodoSchema>>

export const VWElasticsearch = Layer.effect(
  VWPortElasticsearch,
  Effect.all([PortElasticsearch, SqlClient.SqlClient]).pipe(
    Effect.flatMap(([elasticsearch, sql]) => {
      const vwGroupPersonTodo = () =>
        Effect.tryPromise(() => elasticsearch.indices.exists({ index: "vw_group_person_todo" })).pipe(
          Effect.flatMap((indexExists) =>
            indexExists ?
              Effect.tryPromise(() => elasticsearch.indices.delete({ index: "vw_group_person_todo" })).pipe(
                Effect.map(() => true)
              ) :
              Effect.succeed(false)
          ),
          Effect.flatMap(() =>
            Effect.tryPromise(() =>
              elasticsearch.indices.create({
                index: "vw_group_person_todo",
                mappings: {
                  properties: {
                    group: { type: "object" },
                    person: { type: "object" },
                    todo: { type: "object" }
                  }
                }
              })
            )
          ),
          Effect.flatMap(() =>
            sql`SELECT * FROM vw_group_person_todo`.pipe(
              Effect.catchTag("SqlError", Effect.die),
              Effect.flatMap((rows) =>
                Effect.all(rows.map((row) => Schema.decodeUnknown(GroupPersonTodoSchema())(row)))
              ),
              Effect.catchTag("ParseError", Effect.die),
              Effect.flatMap((vwUPPs) =>
                Effect.all(vwUPPs.map((vwUPP) =>
                  Effect.tryPromise(() =>
                    elasticsearch.create({
                      body: { group: vwUPP.group, person: vwUPP.person, todo: vwUPP.todo },
                      id: String(vwUPP.person.id),
                      index: "vw_group_person_todo"
                    })
                  )
                ))
              )
            )
          ),
          Effect.catchTag("UnknownException", Effect.die),
          Effect.asVoid
        )

      return Effect.all([
        vwGroupPersonTodo().pipe(Effect.tap(() => Effect.logInfo("Elasticsearch updated by vwGroupPersonTodo")))
      ]).pipe(
        Effect.map(() => VWPortElasticsearch.of({ vwGroupPersonTodo }))
      )
    })
  )
)
