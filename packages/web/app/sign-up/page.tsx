"use client";

import { useState } from "react";
import { authClient } from "@/util/auth-client";

// export const metadata: Metadata = {
//   title: "sign-up",
//   description: "sign-up",
// };

export default function Page() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const signUp = async () => {
    try {
      await authClient.signUp.email(
        {
          email,
          name,
          password,
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
      console.error("Sign up error:", error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={signUp}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            type="text"
            value={name}
          />
        </div>
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
