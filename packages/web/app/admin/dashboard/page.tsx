"use client";

import { ServiceList } from "@/component/service-list";
import { useEffect, useState } from "react";
import { authClient } from "@/util/auth-client";

// export const metadata: Metadata = {
//   title: "admin dashboard",
//   description: "admin dashboard",
// };

export default function Page() {
  const [session, setSession] = useState<
    typeof authClient.$Infer.Session | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    setLoading(true);
    try {
      const newSession = await authClient.getSession();
      setSession(newSession.data);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  if (!session) {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <p>No user session found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ServiceList params={{}} />
    </div>
  );
}
