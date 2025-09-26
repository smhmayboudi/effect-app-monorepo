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
  private listeners: Map<string, Set<(value: string | null) => void>> =
    new Map();

  constructor() {
    window.addEventListener("storage", (event) => {
      if (event.key && this.listeners.has(event.key)) {
        const listeners = this.listeners.get(event.key)!;
        listeners.forEach((callback) => callback(event.newValue));
      }
    });
  }

  setItem(key: string, value: string): void {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return localStorage.getItem(key);
  }

  subscribe(key: string, callback: (value: string | null) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    const listeners = this.listeners.get(key)!;
    listeners.add(callback);
    callback(this.getItem(key));

    return () => {
      listeners.delete(callback);
    };
  }
}
