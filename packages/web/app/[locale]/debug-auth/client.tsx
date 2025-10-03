"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Client() {
  const { data, error, isPending, refetch } = authClient.useSession();
  const [cookies, setCookies] = useState<string>("");

  useEffect(() => {
    refetch();
    setCookies(document.cookie);
  }, [refetch]);

  return (
    <div>
      <h2>Auth Debug Info:</h2>
      <p>
        <strong>Cookies in document:</strong> {cookies || "None"}
      </p>
      <p>
        <strong>Session:</strong>{" "}
        {data ? JSON.stringify(data, null, 2) : "No session"}
      </p>
      <p>
        <strong>Loading:</strong> {isPending ? "Yes" : "No"}
      </p>
      <button
        aria-disabled={isPending}
        disabled={isPending}
        onClick={() => refetch()}
      >
        {isPending ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}
