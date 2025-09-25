"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hook/use-auth";

export default function Client() {
  const { loading, refreshSession, session } = useAuth();
  const [cookies, setCookies] = useState<string>("");

  useEffect(() => {
    refreshSession();
    setCookies(document.cookie);
  }, [refreshSession]);

  return (
    <div>
      <h2>Auth Debug Info:</h2>
      <p>
        <strong>Cookies in document:</strong> {cookies || "None"}
      </p>
      <p>
        <strong>Session:</strong>{" "}
        {session ? JSON.stringify(session, null, 2) : "No session"}
      </p>
      <p>
        <strong>Loading:</strong> {loading ? "Yes" : "No"}
      </p>
      <button onClick={refreshSession} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh Session"}
      </button>
    </div>
  );
}
