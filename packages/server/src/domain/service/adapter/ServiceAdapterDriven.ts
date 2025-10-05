import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Service, ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { ServiceErrorAlreadyExists } from "@template/domain/service/application/ServiceApplicationErrorAlreadyExists"
import { ServiceErrorNotFound } from "@template/domain/service/application/ServiceApplicationErrorNotFound"
import { Effect, Layer } from "effect"
import { buildSelectCountQuery, buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { formatDateTimeForSQL } from "../../../util/Date.js"
import { ServicePortDriven } from "../application/ServiceApplicationPortDriven.js"

export const ServiceDriven = Layer.effect(
  ServicePortDriven,
  SqlClient.SqlClient.pipe(
    Effect.flatMap((sql) =>
      Effect.sync(() => {
        const readById = (id: ServiceId) =>
          sql`SELECT id, name, text, created_at, updated_at, deleted_at FROM tbl_service WHERE id = ${id}`
            .pipe(
              Effect.catchTag("SqlError", Effect.die),
              Effect.flatMap((rows) =>
                rows.length === 0
                  ? Effect.fail(new ServiceErrorNotFound({ id }))
                  : Effect.succeed(rows[0])
              ),
              Effect.flatMap(Service.decodeUnknown),
              Effect.catchTag("ParseError", Effect.die),
              Effect.withSpan("ServiceDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
            )

        const buildUpdateQuery = (id: ServiceId, service: Omit<Service, "id">) =>
          service.deletedAt ?
            sql<{ id: string }>`UPDATE tbl_service SET ${
              sql.update({
                ...service,
                createdAt: formatDateTimeForSQL(service.createdAt),
                updatedAt: formatDateTimeForSQL(service.updatedAt),
                deletedAt: formatDateTimeForSQL(service.deletedAt)
              })
            } WHERE id = ${id} RETURNING id` :
            sql<{ id: string }>`UPDATE tbl_service SET ${
              sql.update({
                ...service,
                createdAt: formatDateTimeForSQL(service.createdAt),
                updatedAt: formatDateTimeForSQL(service.updatedAt),
                deletedAt: formatDateTimeForSQL(service.deletedAt)
              })
            }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

        const update = (
          id: ServiceId,
          service: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>
        ) =>
          readById(id).pipe(
            Effect.flatMap((oldService) => buildUpdateQuery(id, { ...oldService, ...service })),
            Effect.catchTag("SqlError", (sqlError) =>
              (String(sqlError.cause).toLowerCase().includes("unique")) ?
                Effect.fail(new ServiceErrorAlreadyExists({ name: service.name ?? "" }))
                : Effect.die(sqlError)),
            Effect.flatMap((rows) => Effect.succeed(rows[0])),
            Effect.map((row) => ServiceId.make(row.id)),
            Effect.withSpan("ServiceDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, service } })
          )

        return ServicePortDriven.of({
          create: (service) =>
            sql<
              { id: string }
            >`INSERT INTO tbl_service ${sql.insert(service)} RETURNING id`.pipe(
              Effect.catchTag("SqlError", (sqlError) =>
                (String(sqlError.cause).toLowerCase().includes("unique")) ?
                  Effect.fail(new ServiceErrorAlreadyExists({ name: service.name }))
                  : Effect.die(sqlError)),
              Effect.flatMap((rows) => Effect.succeed(rows[0])),
              Effect.map((row) => ServiceId.make(row.id)),
              Effect.withSpan("ServiceDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", service } })
            ),
          delete: (id) =>
            update(id, { deletedAt: new Date() }).pipe(Effect.catchTag("ServiceErrorAlreadyExists", Effect.die)),
          readAll: (urlParams) =>
            Effect.all({
              data: buildSelectQuery<Service>(sql, "tbl_service", urlParams).pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.flatMap((services) => Effect.all(services.map((service) => Service.decodeUnknown(service)))),
                Effect.catchTag("ParseError", Effect.die)
              ),
              total: buildSelectCountQuery(sql, "tbl_service", urlParams).pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.map((rows) => rows[0]?.countId ?? 0)
              )
            }).pipe(
              Effect.withSpan("ServiceDriven", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams }
              })
            ),
          readById,
          readByIds: (ids) =>
            sql`SELECT id, name, text, created_at, updated_at, deleted_at FROM tbl_service WHERE id IN ${sql.in(ids)}`
              .pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.flatMap((rows) =>
                  Effect.all(
                    ids.map((id) => {
                      const row = rows.find((r) => r.id === id)
                      if (!row) {
                        return Effect.fail(new ServiceErrorNotFound({ id }))
                      }
                      return Service.decodeUnknown(row)
                    })
                  )
                ),
                Effect.catchTag("ParseError", Effect.die),
                Effect.withSpan("ServiceDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIds", ids } })
              ),
          update
        })
      })
    )
  )
)
