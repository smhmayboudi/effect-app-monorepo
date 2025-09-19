import { useState } from "react";
import { Form } from "react-router";
import { authClient } from "~/libs/auth-client";

export default function UserUpdate() {
  const [name, setName] = useState("");

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
          },
        }
      );
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  return (
    <div>
      <h2>User Update</h2>
      <Form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          type="text"
          value={name}
        />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
