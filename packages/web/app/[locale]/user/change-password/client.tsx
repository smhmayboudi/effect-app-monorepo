"use client";

import { useActionState, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { changePassword } from "./action";
import { useTranslations } from "next-intl";

export default function Client() {
  const t = useTranslations("user.change-password");
  const { data, isPending } = authClient.useSession();
  const [state, action, pending] = useActionState(changePassword, null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div>
      <h2>{t("title")}</h2>
      {isPending ? (
        <div>LOADING...</div>
      ) : !data ? (
        <p>No user session found. Please log in.</p>
      ) : (
        <form action={action}>
          <input
            aria-disabled={pending}
            autoComplete="username"
            defaultValue={data.user.email}
            disabled={pending}
            hidden={true}
            id="username"
            name="username"
            type="text"
          />
          <div>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              aria-disabled={pending}
              autoComplete="current-password"
              disabled={pending}
              id="currentPassword"
              name="currentPassword"
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              required
              type="password"
              value={currentPassword}
            />
          </div>
          {state?.errors?.currentPassword && (
            <div style={{ color: "red" }}>
              {state.errors.currentPassword.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              aria-disabled={pending}
              autoComplete="new-password"
              disabled={pending}
              id="newPassword"
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
              type="password"
              value={newPassword}
            />
          </div>
          {state?.errors?.newPassword && (
            <div style={{ color: "red" }}>
              {state.errors.newPassword.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <button aria-disabled={pending} disabled={pending} type="submit">
            {pending ? "Submitting..." : "Submit"}
          </button>
          {state?.message && (
            <p
              aria-live="polite"
              role="status"
              style={{
                color: state.message.includes("successfully") ? "green" : "red",
              }}
            >
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
