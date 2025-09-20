import { useState } from "react";
import { Form } from "react-router";
import { authClient } from "~/libs/auth-client";
import type { Route } from "./+types/user.change-password";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "user change password" },
    { name: "description", content: "user change password" },
  ];
}

export default function UserChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authClient.changePassword(
        {
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
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
      console.error("Change password error:", error);
    }
  };

  return (
    <div>
      <h2>User Change Password</h2>
      <Form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          required
          type="password"
          value={currentPassword}
        />
        <input
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
          type="password"
          value={newPassword}
        />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
