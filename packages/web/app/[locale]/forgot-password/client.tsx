"use client";

import { useActionState, useState } from "react";
import { forgotPassword } from "./action";
import { useTranslations } from "next-intl";
import Button from "@/component/ui/button";

export default function Client() {
  const t = useTranslations("forgot-password");
  const [state, action, pending] = useActionState(forgotPassword, null);
  const [email, setEmail] = useState("");

  return (
    <div>
      <h2>{t("title")}</h2>
      <form action={action}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            aria-disabled={pending}
            disabled={pending}
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
        </div>
        {state?.errors?.email && (
          <div style={{ color: "red" }}>
            {state.errors.email.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <Button aria-disabled={pending} disabled={pending} type="submit">
          {pending ? "Submitting..." : "Submit"}
        </Button>
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
