import { BroadcastChannelService } from "./broadcast-channel"

type LeaderMessage = {
  tabId: string
  timestamp: number
  type: "election" | "leader"
}

/**
 * @example
 * const leaderService = new LeaderElectionService("leader-election");
 * leaderService.onLeaderChange((isLeader) => {
 *   if (isLeader) {
 *     console.log("This tab is now the leader");
 *     // Start tasks that should only run in one tab
 *   } else {
 *     console.log("This tab is no longer the leader");
 *     // Stop exclusive tasks
 *   }
 * });
 */
export class LeaderElectionService {
  private channel: BroadcastChannelService
  private electionInterval: number = 5000
  private intervalId?: number
  private isLeader: boolean = false
  private leaderCallbacks: Array<(isLeader: boolean) => void> = []
  private leaderId: null | string = null
  private tabId: string

  constructor(channelName: string) {
    this.channel = new BroadcastChannelService(channelName)
    this.channel.onMessage<LeaderMessage>((message) => {
      this.handleLeaderMessage(message)
    })
    this.tabId = Math.random().toString(36).substring(2, 10)
    this.startElection()
  }

  cleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.channel.close()
  }

  isCurrentLeader(): boolean {
    return this.isLeader
  }

  onLeaderChange(callback: (isLeader: boolean) => void): () => void {
    this.leaderCallbacks.push(callback)
    callback(this.isLeader)

    return () => {
      this.leaderCallbacks = this.leaderCallbacks.filter(
        (cb) => cb !== callback,
      )
    }
  }

  private announceLeadership(): void {
    this.channel.postMessage({
      tabId: this.tabId,
      timestamp: Date.now(),
      type: "leader",
    })
  }

  private getCurrentLeaderTimestamp(): number {
    return this.leaderId === this.tabId ? Date.now() : 0
  }

  private handleLeaderMessage(message: LeaderMessage): void {
    if (message.type === "election") {
      if (
        !this.leaderId ||
        message.timestamp > this.getCurrentLeaderTimestamp()
      ) {
        this.leaderId = message.tabId
        this.isLeader = this.tabId === this.leaderId
        if (this.isLeader) {
          this.announceLeadership()
        }
        this.notifyLeaderChange()
      }
    } else if (message.type === "leader" && message.tabId !== this.tabId) {
      this.leaderId = message.tabId
      this.isLeader = false
      this.notifyLeaderChange()
    }
  }

  private notifyLeaderChange(): void {
    this.leaderCallbacks.forEach((callback) => callback(this.isLeader))
  }

  private startElection(): void {
    this.intervalId = window.setInterval(() => {
      this.channel.postMessage({
        tabId: this.tabId,
        timestamp: Date.now(),
        type: "election",
      })
    }, this.electionInterval)
  }
}
