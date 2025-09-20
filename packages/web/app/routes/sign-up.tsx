import { Form } from "react-router";
import { useState } from "react";
import { authClient } from "~/libs/auth-client";
import type { Route } from "./+types/sign-up";

export function meta({}: Route.MetaArgs) {
  return [{ title: "sign up" }, { name: "description", content: "sign up" }];
}

export default function SignUp({}: Route.ComponentProps) {
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
      <Form onSubmit={signUp}>
        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          type="text"
          value={name}
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          type="password"
          value={password}
        />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
