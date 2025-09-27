"use client";

import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { BroadcastChannelService } from "@/service/broadcast-channel";

interface BroadcastChannelContextType {
  broadcastChannelService: BroadcastChannelService;
}

interface BroadcastChannelProviderProps {
  channelName: string;
}

const broadcastChannelContext =
  createContext<BroadcastChannelContextType | null>(null);

export const BroadcastChannelProvider: FC<
  PropsWithChildren<BroadcastChannelProviderProps>
> = ({ channelName, children }) => {
  const broadcastChannelService = useMemo(
    () => new BroadcastChannelService(channelName),
    [channelName]
  );

  useEffect(() => {
    return () => {
      broadcastChannelService.close();
    };
  }, [broadcastChannelService]);

  return (
    <broadcastChannelContext.Provider value={{ broadcastChannelService }}>
      {children}
    </broadcastChannelContext.Provider>
  );
};

export const useBroadcastChannel = (): BroadcastChannelService => {
  const context = useContext(broadcastChannelContext);
  if (!context) {
    throw new Error(
      "useBroadcastChannel must be used within a BroadcastChannelProvider"
    );
  }

  return context.broadcastChannelService;
};
