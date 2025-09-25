"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/util/auth-client";

export default function useAuth() {
  const [session, setSession] = useState<
    typeof authClient.$Infer.Session | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      setSession((await authClient.getSession()).data);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, []);

  return {
    loading,
    refreshSession,
    session,
  };
}
