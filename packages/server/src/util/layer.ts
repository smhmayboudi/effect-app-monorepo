import type { Context } from "effect"
import { Effect, Layer } from "effect"

const makeUnimplemented = (key: string, prop: PropertyKey) => {
  const dead = Effect.die(`${key}: Unimplemented method "${prop.toString()}"`)
  function unimplemented() {
    return dead
  }
  Object.assign(unimplemented, dead)
  Object.setPrototypeOf(unimplemented, Object.getPrototypeOf(dead))

  return unimplemented
}

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

export const makeTestLayer = <I, S extends object>(tag: Context.Tag<I, S>) => (service: Partial<S>): Layer.Layer<I> =>
  Layer.succeed(tag, makeUnimplementedProxy(tag.key, service))
