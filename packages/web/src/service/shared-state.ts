import { BroadcastChannelService } from "./broadcast-channel"

type StateUpdate<T> = {
  key: string
  timestamp: number
  value: T
}

/**
 * @example
 * const stateService = new SharedStateService<{ id: number; name: string }>(
 *   "shared-state",
 * );
 * stateService.subscribe("user", (user) => {
 *   console.log("User updated in any tab:", user);
 * });
 *
 * // Update user in one tab, all others will receive the update
 * stateService.set("user", { name: "John", id: 123 });
 */
export class SharedStateService<T> {
  private channel: BroadcastChannelService
  private listeners: Map<string, Set<(value: T) => void>> = new Map()
  private state: Map<string, { timestamp: number; value: T }> = new Map()

  constructor(channelName: string) {
    this.channel = new BroadcastChannelService(channelName)

    this.channel.onMessage<StateUpdate<T>>((update) => {
      this.handleIncomingUpdate(update)
    })
  }

  get(key: string): T | undefined {
    return this.state.get(key)?.value
  }

  set(key: string, value: T): void {
    const update: StateUpdate<T> = {
      key,
      timestamp: Date.now(),
      value
    }
    this.state.set(key, { timestamp: update.timestamp, value })
    this.channel.postMessage(update)
    this.notifyListeners(key, value)
  }

  subscribe(key: string, callback: (value: T) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    const listeners = this.listeners.get(key)!
    listeners.add(callback)
    const currentValue = this.get(key)
    if (currentValue) {
      callback(currentValue)
    }

    return () => {
      listeners.delete(callback)
    }
  }

  private handleIncomingUpdate(update: StateUpdate<T>): void {
    const currentEntry = this.state.get(update.key)
    if (!currentEntry || update.timestamp > currentEntry.timestamp) {
      this.state.set(update.key, {
        timestamp: update.timestamp,
        value: update.value
      })
      this.notifyListeners(update.key, update.value)
    }
  }

  private notifyListeners(key: string, value: T): void {
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach((callback) => callback(value))
    }
  }
}
