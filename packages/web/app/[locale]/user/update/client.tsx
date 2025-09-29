"use client";

import { useState, useEffect, useActionState } from "react";
import useAuth from "@/hook/use-auth";
import { update } from "./action";
import { useTranslations } from "next-intl";
import Button from "@/component/ui/button";

export default function Client() {
  const t = useTranslations("user.update");
  const { loading, refreshSession, session } = useAuth();
  const [state, action, pending] = useActionState(update, null);

  const [name, setName] = useState("");

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (!state?.errors) {
      refreshSession();
    }
  }, [state, refreshSession]);

  return (
    <div>
      <h2>{t("title")}</h2>
      {loading ? (
        <div>LOADING...</div>
      ) : !session ? (
        <p>No user session found. Please log in.</p>
      ) : (
        <form action={action}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              aria-disabled={pending}
              disabled={pending}
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              type="text"
              value={name}
            />
          </div>
          {state?.errors?.name && (
            <div style={{ color: "red" }}>
              {state.errors.name.map((error, index) => (
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
      )}
    </div>
  );
}
