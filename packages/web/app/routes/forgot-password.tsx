import { useState } from "react";
import { Form } from "react-router";
import { authClient } from "~/libs/auth-client";

export default function ForgotPassword() {
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
      <Form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
