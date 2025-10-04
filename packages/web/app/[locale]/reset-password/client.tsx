"use client";

import { useActionState, useState } from "react";
import { signInEmail } from "./action";
import { useTranslations } from "next-intl";

interface ClientProps {
  token: string;
}

export default function Client({ token }: ClientProps) {
  const t = useTranslations("reset-password");
  const [state, action, pending] = useActionState(signInEmail, null);
  const [newPassword, setNewPassword] = useState("");

  return (
    <div>
      <h2>{t("title")}</h2>
      <form action={action}>
        <input
          aria-disabled={pending}
          defaultValue={token}
          disabled={pending}
          hidden={true}
          id="token"
          name="token"
          type="hidden"
        />
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
    </div>
  );
}
