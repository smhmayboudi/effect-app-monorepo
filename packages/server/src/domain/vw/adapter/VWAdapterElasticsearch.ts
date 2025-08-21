import { SqlClient } from "@effect/sql"
import { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { GroupId, GroupSchema } from "@template/domain/group/application/GroupApplicationDomain"
import { PersonId, PersonSchema } from "@template/domain/person/application/PersonApplicationDomain"
import { TodoId, TodoSchema } from "@template/domain/todo/application/TodoApplicationDomain"
import { Email, UserId, UserSchema } from "@template/domain/user/application/UserApplicationDomain"
import { Effect, Layer, Schema } from "effect"
import { PortElasticsearch } from "../../../infrastructure/application/PortElasticsearch.js"
import { VWPortElasticsearch } from "../application/VWApplicationPortElasticsearch.js"

const UserGroupPersonSchema = () => {
  const inputSchema = Schema.Struct({
    userId: UserSchema.fields.id,
    userOwnerId: UserSchema.fields.ownerId,
    userEmail: UserSchema.fields.email,
    // userCreatedAt: UserSchema.fields.createdAt,
    // userUpdatedAt: UserSchema.fields.updatedAt,
    userCreatedAt: Schema.String,
    userUpdatedAt: Schema.String,
    groupId: GroupSchema.fields.id,
    groupOwnerId: GroupSchema.fields.ownerId,
    groupName: GroupSchema.fields.name,
    // groupCreatedAt: GroupSchema.fields.createdAt,
    // groupUpdatedAt: GroupSchema.fields.updatedAt,
    groupCreatedAt: Schema.String,
    groupUpdatedAt: Schema.String,
    personId: PersonSchema.fields.id,
    personGroupId: PersonSchema.fields.groupId,
    // personBirthday: PersonSchema.fields.birthday,
    personBirthday: Schema.String,
    personFirstName: PersonSchema.fields.firstName,
    personLastName: PersonSchema.fields.lastName,
    // personCreatedAt: PersonSchema.fields.createdAt,
    // personUpdatedAt: PersonSchema.fields.updatedAt
    personCreatedAt: Schema.String,
    personUpdatedAt: Schema.String
  })

  const outputSchema = Schema.Struct({
    user: UserSchema,
    group: GroupSchema,
    person: PersonSchema
  })

  return Schema.transform(
    inputSchema,
    outputSchema,
    {
      decode: (fromA) => ({
        user: {
          id: fromA.userId,
          ownerId: fromA.userOwnerId,
          email: fromA.userEmail,
          createdAt: fromA.userCreatedAt,
          updatedAt: fromA.userUpdatedAt
        },
        group: {
          id: fromA.groupId,
          ownerId: fromA.groupOwnerId,
          name: fromA.groupName,
          createdAt: fromA.groupCreatedAt,
          updatedAt: fromA.groupUpdatedAt
        },
        person: {
          id: fromA.personId,
          groupId: fromA.personGroupId,
          birthday: fromA.personBirthday,
          firstName: fromA.personFirstName,
          lastName: fromA.personLastName,
          createdAt: fromA.personCreatedAt,
          updatedAt: fromA.personUpdatedAt
        }
      }),
      encode: (toI) => ({
        userId: UserId.make(toI.user.id),
        userOwnerId: AccountId.make(toI.user.ownerId),
        userEmail: Email.make(toI.user.email),
        userCreatedAt: toI.user.createdAt,
        userUpdatedAt: toI.user.updatedAt,
        groupId: GroupId.make(toI.group.id),
        groupOwnerId: AccountId.make(toI.group.ownerId),
        groupName: toI.group.name,
        groupCreatedAt: toI.group.createdAt,
        groupUpdatedAt: toI.group.updatedAt,
        personId: PersonId.make(toI.person.id),
        personGroupId: GroupId.make(toI.person.groupId),
        personBirthday: toI.person.birthday,
        personFirstName: toI.person.firstName,
        personLastName: toI.person.lastName,
        personCreatedAt: toI.person.createdAt,
        personUpdatedAt: toI.person.updatedAt
      }),
      strict: true
    }
  )
}
type UserGroupPersonSchema = Schema.Schema.Type<ReturnType<typeof UserGroupPersonSchema>>

const UserTodoSchema = () => {
  const inputSchema = Schema.Struct({
    userId: UserSchema.fields.id,
    userOwnerId: UserSchema.fields.ownerId,
    userEmail: UserSchema.fields.email,
    // userCreatedAt: UserSchema.fields.createdAt,
    // userUpdatedAt: UserSchema.fields.updatedAt,
    userCreatedAt: Schema.String,
    userUpdatedAt: Schema.String,
    todoId: TodoSchema.fields.id,
    todoOwnerId: TodoSchema.fields.ownerId,
    todoDone: TodoSchema.fields.done,
    todoText: TodoSchema.fields.text,
    // todoCreatedAt: TodoSchema.fields.createdAt,
    // todoUpdatedAt: TodoSchema.fields.updatedAt
    todoCreatedAt: Schema.String,
    todoUpdatedAt: Schema.String
  })

  const outputSchema = Schema.Struct({
    user: UserSchema,
    todo: TodoSchema
  })

  return Schema.transform(
    inputSchema,
    outputSchema,
    {
      decode: (fromA) => ({
        user: {
          id: fromA.userId,
          ownerId: fromA.userOwnerId,
          email: fromA.userEmail,
          createdAt: fromA.userCreatedAt,
          updatedAt: fromA.userUpdatedAt
        },
        todo: {
          id: fromA.todoId,
          ownerId: fromA.todoOwnerId,
          done: fromA.todoDone,
          text: fromA.todoText,
          createdAt: fromA.todoCreatedAt,
          updatedAt: fromA.todoUpdatedAt
        }
      }),
      encode: (toI) => ({
        userId: UserId.make(toI.user.id),
        userOwnerId: AccountId.make(toI.user.ownerId),
        userEmail: Email.make(toI.user.email),
        userCreatedAt: toI.user.createdAt,
        userUpdatedAt: toI.user.updatedAt,
        todoId: TodoId.make(toI.todo.id),
        todoOwnerId: AccountId.make(toI.todo.ownerId),
        todoDone: toI.todo.done,
        todoText: toI.todo.text,
        todoCreatedAt: toI.todo.createdAt,
        todoUpdatedAt: toI.todo.updatedAt
      }),
      strict: true
    }
  )
}
type UserTodoSchema = Schema.Schema.Type<ReturnType<typeof UserTodoSchema>>

export const VWElasticsearch = Layer.scoped(
  VWPortElasticsearch,
  Effect.gen(function*() {
    const elasticsearch = yield* PortElasticsearch
    const sql = yield* SqlClient.SqlClient

    const vwUserGroupPerson = (): Effect.Effect<void> =>
      Effect.tryPromise(() => elasticsearch.indices.exists({ index: "vw_user_group_person" })).pipe(
        Effect.flatMap((indexExists) =>
          indexExists ?
            Effect.tryPromise(() => elasticsearch.indices.delete({ index: "vw_user_group_person" })).pipe(
              Effect.flatMap(() => Effect.succeed(true))
            ) :
            Effect.succeed(false)
        ),
        Effect.flatMap(() =>
          Effect.tryPromise(() =>
            elasticsearch.indices.create({
              index: "vw_user_group_person",
              mappings: {
                properties: {
                  user: { type: "object" },
                  group: { type: "object" },
                  person: { type: "object" }
                }
              }
            })
          )
        ),
        Effect.flatMap(() =>
          sql`SELECT * FROM vw_user_group_person`.pipe(
            Effect.catchTag("SqlError", Effect.die),
            Effect.flatMap((rows) => Effect.all(rows.map((row) => Schema.decodeUnknown(UserGroupPersonSchema())(row)))),
            Effect.catchTag("ParseError", Effect.die),
            Effect.flatMap((vwUPPs) =>
              Effect.all(vwUPPs.map((vwUPP) =>
                Effect.tryPromise(() =>
                  elasticsearch.create({
                    body: { user: vwUPP.user, group: vwUPP.group, person: vwUPP.person },
                    id: String(vwUPP.person.id),
                    index: "vw_user_group_person"
                  })
                )
              ))
            )
          )
        ),
        Effect.catchTag("UnknownException", Effect.die),
        Effect.asVoid
      )

    const vwUserTodo = (): Effect.Effect<void> =>
      Effect.tryPromise(() => elasticsearch.indices.exists({ index: "vw_user_todo" })).pipe(
        Effect.flatMap((indexExists) =>
          indexExists ?
            Effect.tryPromise(() => elasticsearch.indices.delete({ index: "vw_user_todo" })).pipe(
              Effect.flatMap(() => Effect.succeed(true))
            ) :
            Effect.succeed(false)
        ),
        Effect.flatMap(() =>
          Effect.tryPromise(() =>
            elasticsearch.indices.create({
              index: "vw_user_todo",
              mappings: {
                properties: {
                  user: { type: "object" },
                  todo: { type: "object" }
                }
              }
            })
          )
        ),
        Effect.flatMap(() =>
          sql`SELECT * FROM vw_user_todo`.pipe(
            Effect.catchTag("SqlError", Effect.die),
            Effect.flatMap((rows) => Effect.all(rows.map((row) => Schema.decodeUnknown(UserTodoSchema())(row)))),
            Effect.catchTag("ParseError", Effect.die),
            Effect.flatMap((vwUPPs) =>
              Effect.all(vwUPPs.map((vwUPP) =>
                Effect.tryPromise(() =>
                  elasticsearch.create({
                    body: { user: vwUPP.user, todo: vwUPP.todo },
                    id: String(vwUPP.todo.id),
                    index: "vw_user_todo"
                  })
                )
              ))
            )
          )
        ),
        Effect.catchTag("UnknownException", Effect.die),
        Effect.asVoid
      )

    yield* vwUserGroupPerson().pipe(Effect.tap(Effect.logInfo("Elasticsearch updated by vwUserGroupPerson")))
    yield* vwUserTodo().pipe(Effect.tap(Effect.logInfo("Elasticsearch updated by vwUserTodo")))

    return { vwUserGroupPerson, vwUserTodo } as const
  })
)
