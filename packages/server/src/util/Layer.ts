import type * as effect from "effect"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

const makeUnimplemented = (key: string, prop: PropertyKey) => () =>
  Effect.die(`${key}: Unimplemented method "${prop.toString()}"`)

const makeUnimplementedProxy = <A extends object>(
  key: string,
  service: Partial<A>
): A =>
  new Proxy({ ...service } as A, {
    get(target, prop, _receiver) {
      if (prop in target) {
        return target[prop as keyof A]
      }
      return ((target as any)[prop] = makeUnimplemented(key, prop))
    },
    has: () => true
  })

export const makeTestLayer =
  <Id, Value extends object>(tag: effect.Context.Tag<Id, Value>) => (service: Partial<Value>): Layer.Layer<Id> =>
    Layer.succeed(tag, makeUnimplementedProxy(tag.key, service))
