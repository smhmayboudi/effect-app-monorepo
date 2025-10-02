"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/component/ui/button";
import { serviceCreate } from "./actions";
import { authClient } from "@/util/auth-client";

export default function Client() {
  const t = useTranslations("user.service-create");
  const { data, isPending } = authClient.useSession();

  const [state, action, pending] = useActionState(serviceCreate, null);
  const [name, setName] = useState("");

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
          <Button type="submit" disabled={pending}>
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
