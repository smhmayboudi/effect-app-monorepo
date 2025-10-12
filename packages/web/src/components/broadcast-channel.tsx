"use client";

import * as React from "react";

import { BroadcastChannelService } from "@/service/broadcast-channel";

interface BroadcastChannelContextType {
  onMessage<T>(callback: (message: T) => void): void;
  postMessage: <T>(message: T) => void;
}

const BroadcastChannelContext =
  React.createContext<BroadcastChannelContextType | null>(null);

interface BroadcastChannelProviderProps {
  channelName: string;
}

export function BroadcastChannelProvider({
  channelName,
  children,
}: React.PropsWithChildren<BroadcastChannelProviderProps>) {
  const broadcastChannelService = React.useMemo(
    () => new BroadcastChannelService(channelName),
    [channelName],
  );

  const onMessage = <T,>(callback: (message: T) => void): void => {
    broadcastChannelService.onMessage(callback);
  };

  const postMessage = <T,>(message: T): void => {
    broadcastChannelService.postMessage(message);
  };

  return (
    <BroadcastChannelContext.Provider value={{ onMessage, postMessage }}>
      {children}
    </BroadcastChannelContext.Provider>
  );
}

export function useBroadcastChannel() {
  const context = React.useContext(BroadcastChannelContext);
  if (context === undefined) {
    throw new Error(
      "useBroadcastChannel must be used within a BroadcastChannelProvider",
    );
  }
  return context;
}
