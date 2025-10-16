"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from "react";

import { BroadcastChannelService } from "@/service/broadcast-channel";

interface BroadcastChannelContextType {
  onMessage<T>(callback: (message: T) => void): void;
  postMessage: <T>(message: T) => void;
}

const BroadcastChannelContext =
  createContext<BroadcastChannelContextType | null>(null);

interface BroadcastChannelProviderProps {
  channelName: string;
}

export function BroadcastChannelProvider({
  channelName,
  children,
}: PropsWithChildren<BroadcastChannelProviderProps>) {
  const broadcastChannelService = useMemo(
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
    <BroadcastChannelContext value={{ onMessage, postMessage }}>
      {children}
    </BroadcastChannelContext>
  );
}

export function useBroadcastChannel() {
  const context = useContext(BroadcastChannelContext);
  if (context === undefined) {
    throw new Error(
      "useBroadcastChannel must be used within a BroadcastChannelProvider",
    );
  }
  return context;
}
