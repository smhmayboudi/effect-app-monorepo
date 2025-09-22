"use client";

import { useState } from "react";
import { authClient } from "@/util/auth-client";

// export const metadata: Metadata = {
//   title: "user change-password",
//   description: "user change-password",
// };

export default function Page() {
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
      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}
