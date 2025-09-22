"use client";

import { useState } from "react";
import { authClient } from "@/util/auth-client";

// export const metadata: Metadata = {
//   title: "forgot-password",
//   description: "forgot-password",
// };

export default function Page() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authClient.forgetPassword(
        {
          email,
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
          },
        }
      );
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
