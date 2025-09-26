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
    this.channel = new BroadcastChannel(channelName);
  }

  close(): void {
    this.channel.close();
  }

  onMessage<T>(callback: (message: T) => void): () => void {
    const handler = (event: MessageEvent<T>) => callback(event.data);
    this.channel.addEventListener("message", handler);

    return () => {
      this.channel.removeEventListener("message", handler);
    };
  }

  postMessage<T>(message: T): void {
    this.channel.postMessage(message);
  }
}
