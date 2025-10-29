import { assert, describe, it } from "@effect/vitest"
import { ActorId } from "@template/domain/Actor"
import { Service, ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { ServiceErrorNotFound } from "@template/domain/service/application/ServiceApplicationErrorNotFound"
import { ServicePortDriven } from "@template/server/domain/service/application/ServiceApplicationPortDriven"
import { ServicePortDriving } from "@template/server/domain/service/application/ServiceApplicationPortDriving"
import { ServiceUseCase } from "@template/server/domain/service/application/ServiceApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { ResultPersistenceTest } from "@template/server/infrastructure/adapter/ResultPersistence"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

describe("ServiceUseCase", () => {
  it.scoped("should be created", () =>
    ServicePortDriving.pipe(
      Effect.flatMap((services) =>
        services.create({
          ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
          name: "test"
        }).pipe(
          withSystemActor,
          Effect.map((serviceId) => {
            assert.strictEqual(serviceId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        ServiceUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(ServicePortDriven)({
            create: (_service) => Effect.succeed(ServiceId.make("00000000-0000-0000-0000-000000000000"))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be deleted", () =>
    ServicePortDriving.pipe(
      Effect.flatMap((services) =>
        services.delete(ServiceId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor,
          Effect.map((serviceId) => {
            assert.strictEqual(serviceId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        ServiceUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(ServicePortDriven)({ delete: (id) => Effect.succeed(id) }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped.fails("should be deleted with ServiceErrorNotFound", () =>
    ServicePortDriving.pipe(
      Effect.flatMap((services) =>
        services.delete(ServiceId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        ServiceUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(ServicePortDriven)({ delete: (id) => Effect.fail(new ServiceErrorNotFound({ id })) }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const serviceTest = new Service({
      id: ServiceId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
      name: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return ServicePortDriving.pipe(
      Effect.flatMap((services) =>
        services.readAll({}).pipe(
          withSystemActor,
          Effect.map((serviceList) => {
            assert.deepStrictEqual(serviceList, {
              data: [serviceTest],
              total: 1
            })
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        ServiceUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(ServicePortDriven)({
            readAll: (_urlParams) =>
              Effect.succeed({
                data: [serviceTest],
                total: 1
              })
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    )
  })

  it.scoped("should be readById", () => {
    const now = new Date()
    const serviceTest = new Service({
      id: ServiceId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
      name: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return ServicePortDriving.pipe(
      Effect.flatMap((services) =>
        services.readById(ServiceId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor,
          Effect.map((service) => {
            assert.strictEqual(service, serviceTest)
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        ServiceUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(ServicePortDriven)({
            readById: (_id) => Effect.succeed(serviceTest),
            readByIds: (_ids) => Effect.succeed([serviceTest])
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    )
  })

  it.scoped.fails("should be readById with ServiceErrorNotFound", () =>
    ServicePortDriving.pipe(
      Effect.flatMap((services) =>
        services.readById(ServiceId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        ServiceUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(ServicePortDriven)({
            readById: (id) => Effect.fail(new ServiceErrorNotFound({ id })),
            readByIds: (ids) => Effect.fail(new ServiceErrorNotFound({ id: ids[0] }))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be update", () =>
    ServicePortDriving.pipe(
      Effect.flatMap((services) =>
        services.update(ServiceId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
          withSystemActor,
          Effect.map((serviceId) => {
            assert.strictEqual(serviceId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        ServiceUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(ServicePortDriven)({
            update: (id, _service) => Effect.succeed(ServiceId.make(id))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped.fails("should be update with ServiceErrorNotFound", () =>
    ServicePortDriving.pipe(
      Effect.flatMap((services) =>
        services.update(ServiceId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        ServiceUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(ServicePortDriven)({
            update: (id, _service) => Effect.fail(new ServiceErrorNotFound({ id }))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))
})
