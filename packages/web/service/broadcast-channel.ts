/**
 * @example
 * const channel = new BroadcastChannelService("app-sync");
 * channel.onMessage<string>((msg) => {
 *   console.log("Message received from another tab:", msg);
 * });
 *
 * // Send message to other tabs
 * channel.postMessage("Hello from current tab!");
 */
export class BroadcastChannelService {
  private channel: BroadcastChannel;

  constructor(channelName: string) {
    if (typeof window === "undefined") {
      // Server-side fallback - create a mock channel
      this.channel = {} as BroadcastChannel;
      return;
    }
    this.channel = new BroadcastChannel(channelName);
  }

  close(): void {
    if (this.channel && "close" in this.channel) {
      this.channel.close();
    }
  }

  onMessage<T>(callback: (message: T) => void): () => void {
    if (!this.channel || !("addEventListener" in this.channel)) {
      return () => {}; // No-op for server-side
    }
    const handler = (event: MessageEvent<T>) => callback(event.data);
    this.channel.addEventListener("message", handler);

    return () => {
      this.channel.removeEventListener("message", handler);
    };
  }

  postMessage<T>(message: T): void {
    if (this.channel && "postMessage" in this.channel) {
      this.channel.postMessage(message);
    }
  }
}
