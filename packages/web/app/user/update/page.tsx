"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/util/auth-client";

// export const metadata: Metadata = {
//   title: "user update",
//   description: "user update",
// };

export default function Page() {
  const [session, setSession] = useState<
    typeof authClient.$Infer.Session | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState("");

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

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authClient.updateUser(
        {
          name,
        },
        {
          onError: (ctx) => {
            console.error("onError", ctx.error);
          },
          onRequest: (ctx) => {
            console.log("onRequest", ctx);
          },
          onSuccess: (ctx) => {
            console.log("onSuccess", ctx);
            refreshSession();
          },
        }
      );
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>User Update</h2>
        <div>LOADING...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h2>User Update</h2>
        <p>No user session found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>User Update</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          type="text"
          value={name}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
