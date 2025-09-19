import { useEffect, useState } from "react";
import { authClient } from "~/libs/auth-client";

export default function DebugAuth() {
  const [session, setSession] = useState<
    typeof authClient.$Infer.Session | null
  >(null);
  const [cookies, setCookies] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    setCookies(document.cookie);
  }, []);

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
