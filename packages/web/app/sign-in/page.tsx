"use client";

import { useState } from "react";
import { authClient } from "@/util/auth-client";

// export const metadata: Metadata = {
//   title: "sign-in",
//   description: "sign-in",
// };

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authClient.signIn.email(
        {
          email,
          password,
          rememberMe: true,
        },
        {
          onError: (ctx) => {
            console.error("onError", ctx);
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
      console.error("Sign in error:", error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
