"use client";

import { ServiceList } from "@/component/service-list";
import { useEffect, useState } from "react";
import { getSession, type Session } from "@/util/auth-client";

// export const metadata: Metadata = {
//   title: "user dashboard",
//   description: "user dashboard",
// };

export default function Page() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    setLoading(true);
    try {
      const newSession = await getSession();
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

  if (loading) {
    return (
      <div>
        <h2>User Dashboard</h2>
        <div>LOADING...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h2>User Dashboard</h2>
        <p>No user session found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>User Dashboard</h2>
      <ServiceList params={{ userId: session.user.id }} />
    </div>
  );
}
