"use client";

import { useActionState, useState } from "react";
import { signInEmail } from "./action";
import { useTranslations } from "next-intl";
import Button from "@/component/ui/button";

export default function Client() {
  const t = useTranslations("sign-in");
  const [state, action, pending] = useActionState(signInEmail, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2>{t("title")}</h2>
      <form action={action}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            aria-disabled={pending}
            autoComplete="username"
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
        <div>
          <label htmlFor="password">Password</label>
          <input
            aria-disabled={pending}
            autoComplete="current-password"
            disabled={pending}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
        </div>
        {state?.errors?.password && (
          <div style={{ color: "red" }}>
            {state.errors.password.map((error, index) => (
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
