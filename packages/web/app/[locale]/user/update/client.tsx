"use client";

import { useState, useEffect, useActionState } from "react";
import { authClient } from "@/lib/auth-client";
import { update } from "./action";
import { useTranslations } from "next-intl";

export default function Client() {
  const t = useTranslations("user.update");
  const { data, isPending } = authClient.useSession();
  const [state, action, pending] = useActionState(update, null);

  const [name, setName] = useState("");

  useEffect(() => {
    if (data?.user?.name) {
      setName(data.user.name);
    }
  }, [data]);

  return (
    <div>
      <h2>{t("title")}</h2>
      {isPending ? (
        <div>LOADING...</div>
      ) : !data ? (
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
