import { Context, type Effect } from "effect"

export interface EventEmitter<Events extends Record<string, any>> {
  emit<K extends keyof Events>(event: K, data: Events[K]): Effect.Effect<void>
  off<K extends keyof Events>(event: K): Effect.Effect<void>
  on<K extends keyof Events>(
    event: K,
    callback: (data: Events[K]) => Effect.Effect<any>
  ): Effect.Effect<void>
  once<K extends keyof Events>(
    event: K,
    callback: (data: Events[K]) => Effect.Effect<any>
  ): Effect.Effect<void>
}

export const PortEventEmitter = <Events extends Record<string, any>>() =>
  Context.GenericTag<EventEmitter<Events>>("PortEventEmitter")
