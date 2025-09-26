const connections: MessagePort[] = [];

// @ts-ignore
self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0];
  connections.push(port);
  port.onmessage = (event: MessageEvent) => {
    connections.forEach((conn) => {
      if (conn !== port) {
        conn.postMessage(event.data);
      }
    });
  };
  port.start();
};

/**
 * @example
 * const workerService = new SharedWorkerService<{
 *   payload: string;
 *   type: string;
 * }>("shared-worker.worker.js");
 * workerService.onMessage((data) => {
 *   console.log("Message from shared worker:", data);
 * });
 *
 * // Send message to all tabs via shared worker
 * workerService.postMessage({ payload: "some data", type: "update" });
 */
export class SharedWorkerService<T> {
  private worker: SharedWorker;
  private port: MessagePort;
  private listeners: Array<(data: T) => void> = [];

  constructor(workerUrl: string) {
    this.worker = new SharedWorker(workerUrl);
    this.port = this.worker.port;
    this.port.onmessage = (event: MessageEvent) => {
      this.listeners.forEach((listener) => listener(event.data));
    };
    this.port.start();
  }

  postMessage(data: T): void {
    this.port.postMessage(data);
  }

  onMessage(callback: (data: T) => void): () => void {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}
