"use client";

import { useCallback, useEffect, useState } from "react";
import { getSession } from "./use-auth.actions";
import type { authClient } from "@/util/auth-client";

export default function useAuth() {
  const [session, setSession] = useState<
    typeof authClient.$Infer.Session | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      setSession((await getSession()).data);
    } catch (error) {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return {
    loading,
    refreshSession,
    session,
  };
}
