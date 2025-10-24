/**
 * @example
 * const storageSync = new StorageSyncService();
 * storageSync.subscribe("app-theme", (theme) => {
 *   console.log("Theme changed:", theme);
 *   if (theme) {
 *     document.body.setAttribute("data-theme", theme);
 *   }
 * });
 *
 * // In any tab:
 * storageSync.setItem("app-theme", "dark");
 */
export class StorageSyncService {
  private listeners: Map<string, Set<(value: null | string) => void>> =
    new Map()

  constructor() {
    window.addEventListener("storage", (event) => {
      if (event.key && this.listeners.has(event.key)) {
        const listeners = this.listeners.get(event.key)!
        listeners.forEach((callback) => callback(event.newValue))
      }
    })
  }

  getItem(key: string): null | string {
    return localStorage.getItem(key)
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  subscribe(callback: (value: null | string) => void, key: string): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    const listeners = this.listeners.get(key)!
    listeners.add(callback)
    callback(this.getItem(key))

    return () => {
      listeners.delete(callback)
    }
  }
}
