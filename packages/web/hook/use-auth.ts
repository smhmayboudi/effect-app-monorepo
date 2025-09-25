"use client";

import { createAuthClient } from "better-auth/react";
import { useCallback, useEffect, useState } from "react";

const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
  basePath: "/auth/00000000-0000-0000-0000-000000000000",
  baseURL: "http://127.0.0.1:3001",
});

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

  const {
    changePassword,
    forgetPassword,
    getSession,
    signIn: { email: signInEmail },
    signOut,
    signUp: { email: signUpEmail },
    updateUser,
  } = authClient;

  return {
    changePassword,
    forgetPassword,
    getSession,
    loading,
    refreshSession,
    session,
    signInEmail,
    signOut,
    signUpEmail,
    updateUser,
  };
}
